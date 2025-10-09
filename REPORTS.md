# Dental Vouchers - Reporting Strategy Documentation

## Overview
This document details the comprehensive reporting strategy implemented for tracking dental voucher lifecycles, calculating lead times, and generating performance metrics across multiple dimensions.

## Core Objective
Enable data-driven decision making by tracking every voucher status transition with timestamps, allowing calculation of lead times between states and identification of process bottlenecks.

## Database Architecture for Reporting

### 1. Status History Table (`voucher_status_history`)
**Purpose**: Captures every status change as an immutable audit log.

**Schema**:
```sql
- id: UUID (Primary Key)
- voucher_id: UUID (Foreign Key to vouchers)
- previous_status: TEXT (nullable for initial creation)
- new_status: TEXT (required)
- changed_at: TIMESTAMPTZ (when the change occurred)
- changed_by: UUID (user who made the change)
- clinic_id: UUID (for multi-tenant isolation)
```

**Key Features**:
- Automatic population via database triggers
- Captures both INSERT (initial status) and UPDATE (status changes)
- Preserves complete audit trail
- Enables time-based analysis

### 2. Reporting Views

#### 2.1 `voucher_lead_times`
**Purpose**: Calculates the time (in days) between consecutive status transitions for each voucher.

**Key Columns**:
- `voucher_id`, `voucher_number`, `patient_name`, `doctor_name`
- `previous_status`, `new_status`
- `changed_at`
- `lead_time_days` (calculated using LAG window function)

**Use Cases**:
- Identify bottlenecks in the voucher lifecycle
- Calculate average processing times between states
- Monitor individual voucher progression speed

#### 2.2 `current_status_distribution`
**Purpose**: Provides real-time snapshot of voucher distribution across all statuses.

**Key Columns**:
- `status`
- `clinic_id`
- `count` (number of vouchers)
- `percentage` (relative to total)

**Use Cases**:
- Dashboard status cards
- Workload distribution analysis
- Status-based filtering

#### 2.3 `doctor_performance_metrics`
**Purpose**: Aggregates voucher metrics by doctor for performance analysis.

**Key Columns**:
- `doctor_id`, `doctor_name`
- Status counts: `recebido_count`, `utilizado_count`, `submetido_count`, `pago_ars_count`, `pago_medico_count`
- Financial totals: `total_submetido`, `total_pago_ars`, `total_pago_medico`

**Use Cases**:
- Doctor workload comparison
- Financial performance tracking
- Completion rate analysis

#### 2.4 `monthly_status_metrics`
**Purpose**: Provides time-series data for trend analysis and monthly reporting.

**Key Columns**:
- `clinic_id`, `month` (truncated to month)
- `doctor_id`, `doctor_name`
- `new_status`
- `transition_count`
- `avg_lead_time_days`
- `percentage_of_month`

**Use Cases**:
- Monthly trend analysis
- Seasonal pattern identification
- Doctor-specific monthly performance
- Lead time trending over time

## Voucher Lifecycle States

The system tracks six distinct states in the voucher lifecycle:

1. **Pendente de Entrega** (Pending Delivery)
   - Optional initial state
   - Voucher created but not yet delivered to patient

2. **Recebido** (Received)
   - Most common initial state
   - Patient has received the voucher

3. **Utilizado** (Used)
   - Patient has used the voucher for dental services

4. **Submetido** (Submitted)
   - Clinic has submitted voucher for reimbursement

5. **Pago pela ARS** (Paid by Health Service)
   - Regional health service has processed payment

6. **Pago ao Médico** (Paid to Doctor)
   - Final state - doctor has been compensated

## Automatic Tracking Mechanism

### Database Triggers
Two triggers ensure complete tracking without application code changes:

1. **`voucher_initial_status_trigger`**
   - Fires: AFTER INSERT on vouchers table
   - Records: Initial voucher creation with NULL previous_status

2. **`voucher_status_change_trigger`**
   - Fires: AFTER UPDATE on vouchers table
   - Records: Status transitions with both previous and new status
   - Condition: Only logs if status actually changed

### Benefits of Trigger-Based Approach
- **Reliability**: Cannot be bypassed by application code
- **Consistency**: All changes tracked regardless of source
- **Performance**: Minimal overhead, happens at database level
- **Simplicity**: No need to modify existing application logic

## Reporting Dashboard Components

### 1. Status Distribution Chart
- **Type**: Bar chart with color-coded statuses
- **Data Source**: `current_status_distribution` view
- **Updates**: Real-time as vouchers change status

### 2. Lead Time Analytics
- **Type**: Horizontal bar chart
- **Data Source**: `voucher_lead_times` view aggregated
- **Metrics**: Average days between each status transition
- **Purpose**: Identify process bottlenecks

### 3. Doctor Performance Table
- **Type**: Data table with counts and financial totals
- **Data Source**: `doctor_performance_metrics` view
- **Sorting**: By doctor name or any metric column

### 4. Time-Series Analysis
- **Type**: Line/area charts (future enhancement)
- **Data Source**: `monthly_status_metrics` view
- **Purpose**: Trend identification and forecasting

## Data Export Capabilities

### CSV Export
- **Includes**: All visible metrics from current view
- **Format**: Comma-separated values with headers
- **Sections**: Status distribution, doctor metrics, lead times
- **Use Case**: External analysis in Excel, further processing

## Performance Optimizations

### Indexes Created
```sql
- idx_voucher_status_history_voucher_id
- idx_voucher_status_history_clinic_id
- idx_voucher_status_history_changed_at
- idx_voucher_status_history_status
```

### Why Views Instead of Computed Columns
- **Flexibility**: Can be modified without schema changes
- **Performance**: Pre-computed aggregations
- **Maintenance**: Easier to update business logic
- **Security**: Can apply additional RLS policies

## Multi-Tenant Isolation

### Row-Level Security (RLS)
All tables and views respect clinic isolation:
- Users only see data from their assigned clinic
- Automatic filtering based on `auth.uid()`
- Applied at database level for security

### Clinic-Scoped Queries
All views include `clinic_id` for proper data isolation:
```sql
WHERE clinic_id IN (
  SELECT clinic_id FROM profiles WHERE user_id = auth.uid()
)
```

## Key Metrics and KPIs

### Lead Time Metrics
- **Recebido → Utilizado**: Service delivery speed
- **Utilizado → Submetido**: Administrative efficiency
- **Submetido → Pago pela ARS**: Reimbursement speed
- **Pago pela ARS → Pago ao Médico**: Payment processing

### Volume Metrics
- **Total vouchers by status**: Workload distribution
- **Monthly transitions**: Processing capacity
- **Doctor utilization**: Balanced workload

### Financial Metrics
- **Total submitted value**: Revenue in pipeline
- **Total paid by ARS**: Confirmed revenue
- **Total paid to doctors**: Completed transactions

## Future Enhancements

### Planned Features
1. **Predictive Analytics**: Estimate completion dates based on historical lead times
2. **Alerts System**: Notify when vouchers exceed expected lead times
3. **Comparative Analysis**: Month-over-month, year-over-year comparisons
4. **Custom Date Ranges**: User-defined reporting periods
5. **Drill-Down Capabilities**: Click on metrics to see underlying vouchers

### Potential View Additions
1. **patient_lifetime_value**: Track patient voucher history
2. **daily_operations_summary**: For daily standup meetings
3. **reimbursement_forecast**: Predict incoming payments
4. **bottleneck_analysis**: Automatic identification of process delays

## Reporting Best Practices

### For Clinic Administrators
1. **Review daily**: Check current status distribution
2. **Monitor weekly**: Analyze lead times for bottlenecks
3. **Report monthly**: Generate comprehensive reports for stakeholders

### For System Optimization
1. **Identify patterns**: Look for recurring delays at specific stages
2. **Balance workload**: Redistribute vouchers among doctors if needed
3. **Process improvement**: Focus on stages with longest lead times

## Technical Implementation Notes

### Technology Stack
- **Database**: PostgreSQL with Supabase
- **Views**: SQL views with window functions
- **Frontend**: React with Recharts for visualization
- **Export**: Client-side CSV generation

### Data Freshness
- **Real-time**: Status distribution updates immediately
- **Near real-time**: Lead times update within seconds
- **Cached**: Monthly metrics can be cached for performance

## Maintenance and Monitoring

### Regular Tasks
1. **Index maintenance**: Monitor and rebuild if needed
2. **View performance**: Check execution plans quarterly
3. **Data quality**: Verify trigger execution logs

### Health Checks
- Ensure all vouchers have history records
- Verify lead time calculations are reasonable
- Check for orphaned history records

## Conclusion

This reporting strategy provides comprehensive visibility into the voucher lifecycle through:
- Automatic, reliable data capture via triggers
- Pre-computed views for performance
- Multi-dimensional analysis capabilities
- Real-time and historical reporting

The system is designed to scale with the business while maintaining query performance and data integrity.
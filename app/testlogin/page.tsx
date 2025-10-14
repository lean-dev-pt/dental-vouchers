'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [logs, setLogs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addLog = (message: string) => {
    const timestamp = new Date().toISOString()
    const logMessage = `[${timestamp}] ${message}`
    console.log(logMessage)
    setLogs(prev => [...prev, logMessage])
  }

  const handleSignup = async () => {
    setIsLoading(true)
    setLogs([]) // Clear previous logs

    addLog('=== STARTING SIGNUP TEST ===')
    addLog(`Raw email from state: "${email}"`)
    addLog(`Raw password length: ${password.length}`)
    addLog(`Email after trim: "${email.trim()}"`)

    // Test 1: Basic validation
    addLog('Step 1: Testing email format')
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isValidFormat = emailRegex.test(email.trim())
    addLog(`Email format valid: ${isValidFormat}`)

    if (!isValidFormat) {
      addLog('ERROR: Email format validation failed')
      setIsLoading(false)
      return
    }

    // Test 2: Check email domain
    addLog('Step 2: Checking email domain')
    const domain = email.split('@')[1]
    addLog(`Domain: ${domain}`)

    // Test 3: Initialize Supabase client
    addLog('Step 3: Initializing Supabase client')
    let supabase
    try {
      supabase = createClient()
      addLog('Supabase client initialized successfully')
    } catch (error) {
      addLog(`ERROR initializing Supabase: ${error}`)
      setIsLoading(false)
      return
    }

    // Test 3.5: Check for existing session
    addLog('Step 3.5: Checking for existing session')
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData.session) {
        addLog(`WARNING: Existing session found!`)
        addLog(`Existing session user: ${sessionData.session.user.email}`)
        addLog(`Existing session ID: ${sessionData.session.user.id}`)
      } else {
        addLog('No existing session found (expected for new signup)')
      }
    } catch (error) {
      addLog(`ERROR checking session: ${error}`)
    }

    // Test 4: Prepare signup payload
    addLog('Step 4: Preparing signup payload')
    const signupPayload = {
      email: email.trim(),
      password: password,
    }
    addLog(`Payload email: "${signupPayload.email}"`)
    addLog(`Payload password length: ${signupPayload.password.length}`)

    // Test 5: Attempt signup
    addLog('Step 5: Calling supabase.auth.signUp()')
    addLog(`Timestamp before call: ${new Date().toISOString()}`)

    try {
      const { data, error } = await supabase.auth.signUp(signupPayload)

      addLog(`Timestamp after call: ${new Date().toISOString()}`)
      addLog('Response received from Supabase')

      // Test 6: Analyze response
      addLog('Step 6: Analyzing response')
      addLog('=== FULL RESPONSE DATA ===')
      addLog(JSON.stringify(data, null, 2))
      addLog('=== END FULL RESPONSE ===')

      addLog(`Error: ${error ? JSON.stringify(error, null, 2) : 'null'}`)
      addLog(`Data.user: ${data.user ? 'EXISTS' : 'NULL'}`)
      addLog(`Data.session: ${data.session ? 'EXISTS' : 'NULL'}`)

      if (data.user) {
        addLog('=== USER DETAILS ===')
        addLog(`User ID: ${data.user.id}`)
        addLog(`User email: ${data.user.email}`)
        addLog(`User created_at: ${data.user.created_at}`)
        addLog(`User confirmed: ${data.user.email_confirmed_at ? 'YES' : 'NO'}`)
        addLog(`User identities count: ${data.user.identities?.length || 0}`)
        addLog(`User metadata: ${JSON.stringify(data.user.user_metadata || {})}`)

        // CRITICAL: Compare requested vs returned email
        addLog('=== EMAIL COMPARISON ===')
        addLog(`Requested email: "${signupPayload.email}"`)
        addLog(`Returned email: "${data.user.email}"`)
        addLog(`Emails match: ${signupPayload.email === data.user.email ? 'YES' : 'NO ⚠️ MISMATCH!'}`)
      }

      if (error) {
        addLog('=== ERROR DETAILS ===')
        addLog(`ERROR from Supabase: ${error.message}`)
        addLog(`Error code: ${error.status}`)
        addLog(`Error name: ${error.name}`)
      } else if (!data.user) {
        addLog('WARNING: No error but user is NULL (possible silent failure)')
      } else if (signupPayload.email !== data.user.email) {
        addLog('⚠️ CRITICAL: Email mismatch - Supabase returned different user!')
      } else {
        addLog('SUCCESS: User created successfully')
      }

    } catch (error) {
      const err = error as Error
      addLog(`EXCEPTION during signup: ${err.message}`)
      addLog(`Exception stack: ${err.stack}`)
    }

    addLog('=== SIGNUP TEST COMPLETE ===')
    setIsLoading(false)
  }

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Test Signup with Logging</h1>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="text"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jorge@jorgedaniel.pt"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSignup}
                disabled={isLoading || !email || !password}
                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Testing...' : 'Test Signup'}
              </button>

              <button
                onClick={clearLogs}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Clear Logs
              </button>
            </div>
          </div>
        </div>

        <div className="bg-black text-green-400 p-6 rounded-lg shadow-lg font-mono text-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Debug Logs</h2>
            <span className="text-xs text-gray-500">{logs.length} entries</span>
          </div>

          <div className="space-y-1 max-h-[600px] overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">No logs yet. Enter an email and password, then click &quot;Test Signup&quot;.</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="text-xs leading-relaxed">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <h3 className="font-bold text-yellow-800 mb-2">Test Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-900">
            <li>Enter the email: jorge@jorgedaniel.pt</li>
            <li>Enter any password (min 6 chars)</li>
            <li>Click &quot;Test Signup&quot;</li>
            <li>Watch the logs below to see exactly what happens</li>
            <li>Check browser console (F12) for additional details</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

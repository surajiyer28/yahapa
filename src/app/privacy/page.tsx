import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Privacy Policy
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Introduction
              </h2>
              <p>
                YAHAPA (Your Health and Productivity App) is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, and safeguard your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Information We Collect
              </h2>
              <p className="mb-3">We collect the following types of information:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Account Information:</strong> Email address and name when you create an account</li>
                <li><strong>Health Data:</strong> Step count, calories burned, and distance traveled (if you connect Google Fit)</li>
                <li><strong>Productivity Data:</strong> Tasks, notes, completion status, and pomodoro session records</li>
                <li><strong>Habit Tracking:</strong> Custom habit items and completion dates</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                How We Store Your Data
              </h2>
              <p>
                All your data is securely stored in Supabase, a secure cloud database platform.
                We use industry-standard encryption and security practices to protect your information.
                Your data is stored in compliance with applicable data protection regulations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Google Fit Integration
              </h2>
              <p>
                If you choose to connect your Google Fit account, we will access your fitness data
                (steps, calories, distance) to display it within the app. We only access the specific
                data types necessary for the app&apos;s functionality. You can disconnect Google Fit at any
                time, and we will stop accessing your fitness data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                How We Use Your Information
              </h2>
              <p className="mb-3">We use your information to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide and improve the app&apos;s features and functionality</li>
                <li>Display your health and productivity metrics</li>
                <li>Track your habits and tasks</li>
                <li>Send you important updates about the app (if necessary)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Data Sharing and Selling
              </h2>
              <p className="font-semibold">
                We do not sell, rent, or share your personal data with third parties for marketing purposes.
                Your data belongs to you.
              </p>
              <p className="mt-3">
                We only share data with service providers necessary to operate the app (such as Supabase for
                data storage and Google Fit for health data integration), and only to the extent necessary
                to provide these services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Your Rights
              </h2>
              <p className="mb-3">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Delete your account and all associated data</li>
                <li>Disconnect third-party integrations like Google Fit</li>
                <li>Export your data (contact us for assistance)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Data Retention
              </h2>
              <p>
                We retain your data for as long as your account is active. If you delete your account,
                we will permanently delete all your personal data from our systems within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Children&apos;s Privacy
              </h2>
              <p>
                YAHAPA is not intended for use by children under 13 years of age. We do not knowingly
                collect personal information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes
                by updating the &quot;Last updated&quot; date at the top of this policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy or your data, please contact us
                through the app or by email.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

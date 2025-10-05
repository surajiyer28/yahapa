import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Terms of Service
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Acceptance of Terms
              </h2>
              <p>
                By accessing and using YAHAPA (Your Health and Productivity App), you accept and agree
                to be bound by these Terms of Service. If you do not agree to these terms, please do
                not use the app.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Description of Service
              </h2>
              <p>
                YAHAPA is a personal health and productivity tracking application that helps you monitor
                your fitness data, manage tasks, track habits, and measure productivity. The app integrates
                with Google Fit to display health metrics and uses AI to assist with task management.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                User Accounts
              </h2>
              <p className="mb-3">When you create an account, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Be responsible for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Health Data Disclaimer
              </h2>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
                  Important Health Information
                </p>
                <p className="text-yellow-800 dark:text-yellow-300">
                  YAHAPA is not a medical device and should not be used for medical diagnosis or treatment.
                  The health data displayed in the app is for informational and motivational purposes only.
                  Always consult with qualified healthcare professionals for medical advice, diagnosis, or
                  treatment. Do not disregard professional medical advice or delay seeking it because of
                  information displayed in this app.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Data Accuracy
              </h2>
              <p>
                While we strive to provide accurate information, we do not guarantee the accuracy,
                completeness, or reliability of any health or productivity data displayed in the app.
                Data sourced from third-party services (such as Google Fit) is subject to the accuracy
                of those services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Acceptable Use
              </h2>
              <p className="mb-3">You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use the app for any illegal or unauthorized purpose</li>
                <li>Attempt to gain unauthorized access to any part of the app or its systems</li>
                <li>Interfere with or disrupt the app&apos;s functionality</li>
                <li>Transmit any malicious code, viruses, or harmful content</li>
                <li>Reverse engineer or attempt to extract the source code of the app</li>
                <li>Use the app to harass, abuse, or harm others</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Third-Party Services
              </h2>
              <p>
                The app integrates with third-party services such as Google Fit. Your use of these
                services is subject to their respective terms of service and privacy policies. We are
                not responsible for the practices or content of third-party services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Intellectual Property
              </h2>
              <p>
                The app and its original content, features, and functionality are owned by YAHAPA and
                are protected by international copyright, trademark, and other intellectual property laws.
                You may not copy, modify, distribute, or create derivative works without our express
                written permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Limitation of Liability
              </h2>
              <p>
                To the maximum extent permitted by law, YAHAPA shall not be liable for any indirect,
                incidental, special, consequential, or punitive damages, or any loss of profits or
                revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill,
                or other intangible losses resulting from:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                <li>Your use or inability to use the app</li>
                <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
                <li>Any bugs, viruses, or similar harmful content transmitted through the app</li>
                <li>Any errors or omissions in any content or data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Account Termination
              </h2>
              <p>
                We reserve the right to suspend or terminate your account at any time for violations
                of these Terms of Service or for any other reason we deem necessary. You may also
                delete your account at any time through the app settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Changes to Terms
              </h2>
              <p>
                We reserve the right to modify these terms at any time. If we make material changes,
                we will notify you by updating the &quot;Last updated&quot; date at the top of this page.
                Your continued use of the app after such changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Disclaimer of Warranties
              </h2>
              <p>
                The app is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either
                express or implied, including but not limited to warranties of merchantability, fitness
                for a particular purpose, or non-infringement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Governing Law
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance with applicable laws,
                without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Contact Information
              </h2>
              <p>
                If you have any questions about these Terms of Service, please contact us through
                the app or by email.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Severability
              </h2>
              <p>
                If any provision of these Terms is found to be unenforceable or invalid, that provision
                will be limited or eliminated to the minimum extent necessary so that these Terms will
                otherwise remain in full force and effect.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              ← Back to Login
            </Link>
            <Link
              href="/privacy"
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Privacy Policy →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

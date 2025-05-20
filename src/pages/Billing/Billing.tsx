import React, { useState } from 'react';
import { CreditCard, DollarSign, Users, HardDrive, Plus, ChevronDown, Download, Pen, Trash2 } from 'lucide-react';

const Billing = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [activeTab, setActiveTab] = useState<'subscription' | 'payment' | 'history' | 'invoices'>('subscription');
  const [showTeamForm, setShowTeamForm] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Billing & Subscription</h1>

      {/* Current Plan and Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Current Plan */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Your Current Plan</h2>
          <div className="bg-indigo-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-indigo-700">Free Plan</h3>
                <p className="text-sm text-indigo-600">Basic features for small firms</p>
              </div>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded">Active</span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold">$0<span className="text-sm font-normal text-gray-500">/month</span></p>
              <p className="text-sm text-gray-500 mt-1">Billed monthly</p>
            </div>
          </div>
          <button className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Upgrade Plan
          </button>
        </div>

        {/* Storage Usage */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Document Storage</h2>
            <span className="text-sm font-medium text-gray-500">145.8 MB of 200 MB used</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full mb-2">
            <div className="h-2 bg-indigo-600 rounded-full" style={{ width: '73%' }}></div>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>0 MB</span>
            <span>200 MB</span>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">You're using 73% of your storage. Upgrade for more space.</p>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Team Members</h2>
            <span className="text-sm font-medium text-gray-500">1 of 2 slots used</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Users className="h-4 w-4" />
              </div>
              <div className="ml-3">
                <p className="font-medium">John Doe</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </div>
          </div>
          {!showTeamForm ? (
            <button
              onClick={() => setShowTeamForm(true)}
              className="mt-4 w-full py-2 px-4 border border-dashed border-gray-300 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              <Plus className="h-4 w-4 inline mr-2" /> Add Team Member
            </button>
          ) : (
            <div className="mt-4">
              <h3 className="font-medium mb-3">Invite New Team Member</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="team.member@lawfirm.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option>Admin (Full access)</option>
                    <option>Lawyer (Case management)</option>
                    <option>Paralegal (Document access)</option>
                    <option>Clerk (Limited access)</option>
                  </select>
                </div>
                <div className="flex space-x-3">
                  <button className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Send Invitation
                  </button>
                  <button
                    onClick={() => setShowTeamForm(false)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Billing Navigation */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="flex border-b">
          {(['subscription', 'payment', 'history', 'invoices'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === tab
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Plan Options */}
      {activeTab === 'subscription' && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Choose Your Plan</h2>
            <div className="flex items-center bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1 text-sm font-medium rounded-full ${
                  billingCycle === 'monthly'
                    ? 'bg-white shadow-sm'
                    : 'text-gray-500'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-1 text-sm font-medium rounded-full ${
                  billingCycle === 'annual'
                    ? 'bg-white shadow-sm'
                    : 'text-gray-500'
                }`}
              >
                Annual (Save 20%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free Plan */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1">Free</h3>
                <p className="text-sm text-gray-500">For individual lawyers and small firms</p>
                <p className="mt-4 text-3xl font-bold">$0<span className="text-base font-normal text-gray-500">/month</span></p>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <HardDrive className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">200MB document storage</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Up to 2 team members</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Basic case management</span>
                </div>
              </div>
              <button className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                Current Plan
              </button>
            </div>

            {/* Professional Plan */}
            <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-indigo-500 relative">
              <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
                POPULAR
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1">Professional</h3>
                <p className="text-sm text-gray-500">For growing law firms</p>
                <p className="mt-4 text-3xl font-bold">$29<span className="text-base font-normal text-gray-500">/month</span></p>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <HardDrive className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">10GB document storage</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Up to 10 team members</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Advanced case management</span>
                </div>
              </div>
              <button className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Upgrade to Professional
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1">Enterprise</h3>
                <p className="text-sm text-gray-500">For large firms and corporations</p>
                <p className="mt-4 text-3xl font-bold">$99<span className="text-base font-normal text-gray-500">/month</span></p>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <HardDrive className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Unlimited document storage</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Unlimited team members</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Premium case management</span>
                </div>
              </div>
              <button className="w-full py-2 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors">
                Get Enterprise
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Need a custom plan for your large firm?{' '}
              <a href="#" className="text-indigo-600 hover:underline">
                Contact our sales team
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Payment Methods */}
      {activeTab === 'payment' && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Payment Methods</h2>
            <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
              <Plus className="h-4 w-4 inline mr-2" /> Add Payment Method
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-indigo-500">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center">
                    <span className="font-medium">VISA ending in 4242</span>
                    <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">Primary</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Expires 04/2025</p>
                </div>
                <div className="flex space-x-2">
                  <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600">
                    <Pen className="h-4 w-4" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center">
                <CreditCard className="h-8 w-8 mr-3 text-indigo-600" />
                <div className="text-xs text-gray-500">
                  <p>Billing address: 123 Main St, Suite 100</p>
                  <p>New York, NY 10001, United States</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Billing History */}
      {activeTab === 'history' && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6">Billing History</h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">May 1, 2023</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Professional Plan</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$29.00</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Paid</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 hover:underline">
                      <Download className="h-4 w-4 inline" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;
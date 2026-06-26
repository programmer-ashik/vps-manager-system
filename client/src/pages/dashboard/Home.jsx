import { useAppSelector } from "../../app/hooks";
import { useGetDashboardSummaryQuery } from "../../api/dashboardApi";
import { Link } from "react-router-dom";
import StatusBadge from "../../components/common/StatusBadge";
import { motion } from "framer-motion";
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
};

function StatCard({ label, value, accent = false }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className='p-5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-red-500 dark:bg-red-800 shadow-sm cursor-pointer hover:shadow-md'
    >
      <h3 className='text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2'>
        {label}
      </h3>
      <p
        className={`text-3xl font-bold ${
          accent
            ? "text-accent-600 dark:text-accent-400"
            : "text-neutral-900 dark:text-neutral-100"
        }`}
      >
        {value ?? 0}
      </p>
    </motion.div>
  );
}

export default function Home() {
  const { user } = useAppSelector((s) => s.auth);
  const { data, isLoading, isError } = useGetDashboardSummaryQuery();

  if (isLoading)
    return <div className='p-4 text-neutral-600'>Loading dashboard…</div>;
  if (isError || !data)
    return <div className='p-6 text-red-500'>Failed to load data.</div>;

  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={containerVariants}
      className='max-w-7xl mx-auto p-4 bg-yellow-500'
    >
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-neutral-900 dark:text-gray-200 mb-2'>
          Dashboard
        </h1>
        <p className='text-neutral-600 dark:text-neutral-400'>
          Welcome back, {user?.name || "Admin"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        <StatCard label='Total Users' value={data.usersCount} />
        <StatCard
          label='Pending Server Requests'
          value={data.pendingServerRequests}
          accent
        />
        <StatCard
          label='Paid Server Requests'
          value={data.paidServerRequests}
        />
        <StatCard
          label='Pending Partner Payments'
          value={data.pendingPartnerPayments}
          accent
        />
        <StatCard label='Processing Servers' value={data.processingServers} />
        <StatCard label='Ready to Share' value={data.readyToShareServers} />
        <StatCard
          label='Paid Partner Payments'
          value={data.paidPartnerPayments}
        />
      </div>

      {/* Sections Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {[
          {
            title: "Recent Server Requests",
            data: data.recentServerRequests,
            link: "/server-requests",
            type: "request",
          },
          {
            title: "Recent Partner Payments",
            data: data.recentPartnerPayments,
            link: "/partner-payments",
            type: "payment",
          },
        ].map((section, idx) => (
          <motion.section
            key={idx}
            variants={itemVariants}
            className='border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-800 shadow-sm overflow-hidden'
          >
            <div className='p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center'>
              <h2 className='font-semibold'>{section.title}</h2>
              <Link
                to={section.link}
                className='text-sm text-accent-600 hover:underline'
              >
                View all
              </Link>
            </div>
            <div className='divide-y divide-neutral-200 dark:divide-neutral-800'>
              {section.data?.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                >
                  <Link to={`${section.link}/${item.id}`} className='block p-4'>
                    <div className='flex justify-between items-center'>
                      <div>
                        <p className='font-medium'>
                          {section.type === "request"
                            ? item.serverName
                            : item.partnerName}
                        </p>
                        <p className='text-sm text-neutral-500'>
                          {section.type === "request"
                            ? item.customerName
                            : `$${item.amount}`}
                        </p>
                      </div>
                      <div className='flex gap-2'>
                        <StatusBadge
                          status={item.paymentStatus || item.status}
                        />
                        {item.serverStatus && (
                          <StatusBadge status={item.serverStatus} />
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </motion.div>
  );
}

import Layout from "./layout.jsx";

function AboutUs() {
  return (
    <Layout>
      <div className="min-h-screen from-blue-50 to-white font-array">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            {/* Welcome Message Box */}
            <div className="bg-blue-900/85 rounded-lg shadow-lg p-12 mb-12 text-center transform transition-transform duration-300">
              <h1 className="text-4xl font-bold text-white">
                Welcome to Language Learning Adventure
              </h1>
              <div className="w-24 h-1 bg-white mx-auto my-6"></div>
              <p className="text-gray-300 text-lg">
                Embark on an exciting journey to master new languages through
                play
              </p>
            </div>

            {/* Mission Section */}
            <div className="bg-neutral-200/85 rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-900">
                We are passionate about making language learning fun, engaging,
                and accessible to everyone. Through gamification and interactive
                experiences, we transform the way you learn new languages.
              </p>
            </div>

            
            {/* Features Section */}
            <div className="bg-neutral-200/85 rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                What Makes Us Different
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center p-4 bg-neutral-100/80 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      <svg
                        className="h-6 w-6 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="ml-4 text-gray-700">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const features = [
  "Interactive game-based lessons",
  "Personalized learning paths",
  "Real-time progress tracking",
  "Community challenges",
  "Native speaker audio",
  "Cultural immersion elements",
];

export default AboutUs;

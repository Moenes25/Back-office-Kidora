export default function Profile() {
  return (
    <div>
      <header>
        <section className="h-40 w-full bg-blueSecondary bg-[linear-gradient(135deg,#667eea,#764ba2)]">
          {/* Floating shapes */}
          <div className="absolute w-4 h-4 border-red-700 rounded-full shadow-lg animate-pulse-slow left-64 top-64 bg-white/10"></div>
          <div className="absolute w-8 h-8 rounded-full shadow-lg animate-pulse-slow bottom-64 right-64 bg-white/10"></div>
          <div className="absolute w-6 h-6 rounded-full shadow-lg animate-pulse-slow bottom-64 left-64 bg-white/10"></div>
          <div className="absolute w-10 h-10 rounded-full shadow-lg animate-pulse-slow right-64 top-64 bg-white/10"></div>
          <button className="px-4 py-2 mt-4 ml-4 text-white transition duration-300 border-2 border-white rounded-md hover:bg-white hover:text-blueSecondary">
            {" "}
            Edit Profile
          </button>
        </section>
      </header>
      <h1>hello</h1>
    </div>
  );
}

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RouteUpload, RouteSignIn } from "@/helper/RouteName";
import { showToast } from "@/helper/ShowToast";

function Home() {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.user);

  useEffect(() => {
    // Intersection Observer for scroll-triggered reveals
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handlePlayAlongClick = () => {
    if (isLoggedIn) {
      navigate(RouteUpload);
    } else {
      navigate(RouteSignIn);
      showToast("Please sign in to try the demo", "info");
    }
  };

  return (
    <main className="overflow-x-hidden">
      {/* Hero Section */}
      <section id="hero" className="pt-24 pb-12 lg:py-24 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto px-6">
        <div className="space-y-8 text-center lg:text-left">
          {/* Badge */}
          <div className="reveal inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 text-xs font-medium text-primary uppercase tracking-wide mx-auto lg:mx-0">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            AI-Powered Guitar Learning
          </div>

          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="reveal text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              Master your favourite songs,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                one session at a time.
              </span>
            </h1>
            <p className="reveal text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Aaroh AI turns your practice into a guided, interactive jam: upload
              any song, see exactly what to play, and get instant feedback.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="reveal flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <button
              onClick={handlePlayAlongClick}
              className="w-full sm:w-auto relative overflow-hidden px-8 py-3.5 bg-primary text-white text-base font-semibold rounded-xl shadow-lg shadow-primary/25 hover:scale-[1.02] transition-transform duration-300 flex items-center justify-center gap-2 group"
            >
              <span className="relative z-10">Try Play-Along Demo</span>
              <svg
                className="w-5 h-5 relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
            <button className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-base font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-300 flex items-center justify-center gap-2 group">
              <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 group-hover:bg-white dark:group-hover:bg-gray-700 group-hover:text-primary transition-colors">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </span>
              Watch preview
            </button>
          </div>
        </div>

        {/* Visual Mockup */}
        <div className="reveal relative lg:h-auto flex items-center justify-center">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>

          <div className="relative w-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-float">
            <div className="h-10 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
              </div>
              <div className="flex-1 text-center">
                <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-[10px] text-gray-400 font-mono">
                  <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  aaroh.ai/play
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 19V6a2 2 0 012-2h4a2 2 0 012 2v13m-6 0a2 2 0 002 2h4a2 2 0 002-2m-6 0V9a2 2 0 012-2h4a2 2 0 012 2v10"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1.5"></div>
                    <div className="h-3 w-20 bg-gray-100 dark:bg-gray-800 rounded"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-accent">
                    98% Accuracy
                  </div>
                </div>
              </div>

              <div className="h-24 bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 relative flex items-center justify-center overflow-hidden">
                <div className="flex items-end gap-1 h-12 w-full px-4 justify-center opacity-50">
                  <div className="w-1 h-4 bg-primary rounded-full"></div>
                  <div className="w-1 h-8 bg-primary rounded-full"></div>
                  <div className="w-1 h-12 bg-primary rounded-full"></div>
                  <div className="w-1 h-6 bg-primary/50 rounded-full"></div>
                  <div className="w-1 h-10 bg-primary/30 rounded-full"></div>
                  <div className="w-1 h-5 bg-primary rounded-full"></div>
                  <div className="w-1 h-8 bg-primary rounded-full"></div>
                  <div className="w-1 h-3 bg-primary rounded-full"></div>
                  <div className="w-1 h-12 bg-accent rounded-full shadow-[0_0_10px_rgba(255,0,110,0.5)]"></div>
                  <div className="w-1 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  <div className="w-1 h-4 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                </div>
                <div className="absolute inset-y-0 left-1/2 w-0.5 bg-accent z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="reveal text-sm font-semibold text-primary tracking-wide uppercase mb-3">
              Workflow
            </h2>
            <h3 className="reveal text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
              From audio file to{" "}
              <span className="text-accent">mastery</span>
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-gray-200 via-primary/20 to-gray-200"></div>

            {/* Step 1 */}
            <div className="reveal relative flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl flex items-center justify-center mb-6 z-10">
                <div className="w-16 h-16 rounded-xl bg-blue-50 dark:bg-blue-950 text-primary flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                    />
                  </svg>
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                1. Upload Song
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm px-4">
                Drag & drop any MP3. Our AI instantly isolates instruments and
                detects chords.
              </p>
            </div>

            {/* Step 2 */}
            <div className="reveal relative flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl flex items-center justify-center mb-6 z-10">
                <div className="w-16 h-16 rounded-xl bg-pink-50 dark:bg-pink-950 text-accent flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                2. Play Along
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm px-4">
                Follow the moving timeline. The app listens to your playing via
                microphone.
              </p>
            </div>

            {/* Step 3 */}
            <div className="reveal relative flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl flex items-center justify-center mb-6 z-10">
                <div className="w-16 h-16 rounded-xl bg-yellow-50 dark:bg-yellow-950 text-secondary flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                3. Get Feedback
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm px-4">
                See your accuracy score and detailed breakdown for every chord
                you played.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="reveal text-sm font-semibold text-primary tracking-wide uppercase mb-3">
              Features
            </h2>
            <h3 className="reveal text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
              Everything you need to practice efficiently
            </h3>
            <p className="reveal text-gray-600 dark:text-gray-400 text-lg">
              Replaces your tab app, metronome, and teacher with one intelligent
              interface.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 - Upcoming */}
            <div className="reveal p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-primary/20 dark:hover:border-primary/20 hover:shadow-lg transition-all duration-300 opacity-40 pointer-events-none relative">
              <div className="absolute top-3 right-3 px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-semibold rounded">
                Coming Soon
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 text-primary flex items-center justify-center mb-5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 14.828v2.748m.6-15.098a.75.75 0 10-1.2 0A.75.75 0 001.2 1.63m0 14.972a.75.75 0 101.2 0"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Real-Time Analysis
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                The audio engine analyzes your input latency-free to check if
                you're hitting the right notes on time.
              </p>
            </div>

            {/* Feature 2 - Chord Extraction - Visible */}
            <div className="reveal p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-primary/20 dark:hover:border-primary/20 hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-950 text-accent flex items-center justify-center mb-5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 19V6a2 2 0 012-2h4a2 2 0 012 2v13m-6 0a2 2 0 002 2h4a2 2 0 002-2m-6 0V9a2 2 0 012-2h4a2 2 0 012 2v10"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Chord Extraction
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have tabs? No problem. AI detects chords from the audio
                file automatically.
              </p>
            </div>

            {/* Feature 3 - Upcoming */}
            <div className="reveal p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-primary/20 dark:hover:border-primary/20 hover:shadow-lg transition-all duration-300 opacity-40 pointer-events-none relative">
              <div className="absolute top-3 right-3 px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-semibold rounded">
                Coming Soon
              </div>
              <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-950 text-secondary flex items-center justify-center mb-5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 13a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 7"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Tempo Control
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Slow down complex solos without changing pitch to build muscle
                memory gradually.
              </p>
            </div>

            {/* Feature 4 - Upcoming */}
            <div className="reveal p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-primary/20 dark:hover:border-primary/20 hover:shadow-lg transition-all duration-300 opacity-40 pointer-events-none relative">
              <div className="absolute top-3 right-3 px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-semibold rounded">
                Coming Soon
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center mb-5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6.429 9.75L2.25 12m0 0l4.179 2.25m-4.179-2.25l4.179-2.25m0 5.499l4.179 2.25m0 0L21.75 12M6.75 18.75l4.179-2.25"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Stem Separation
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Mute the original guitar track to play with the backing band, or
                solo it to hear details.
              </p>
            </div>

            {/* Feature 5 - Smart Looping - Visible */}
            <div className="reveal p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-primary/20 dark:hover:border-primary/20 hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-950 text-green-600 flex items-center justify-center mb-5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 5V9m0 0V5m0 4v6a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Smart Looping
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Mark a section to loop continuously until you nail the
                transition perfectly.
              </p>
            </div>

            {/* Feature 6 - Upcoming */}
            <div className="reveal p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-primary/20 dark:hover:border-primary/20 hover:shadow-lg transition-all duration-300 opacity-40 pointer-events-none relative">
              <div className="absolute top-3 right-3 px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-semibold rounded">
                Coming Soon
              </div>
              <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center mb-5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 3l.393 1.192l1.25.036 1.212.3.6 1.165.393-1.192 1.25-.036 1.212-.3.6-1.165.393 1.192 1.25.036 1.212.3.6 1.165"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Performance Tracking
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track your accuracy improvements over time with detailed session
                reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 bg-gradient-to-b from-white dark:from-gray-950 to-blue-50/50 dark:to-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="reveal text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Ready to hear your own progress?
          </h2>
          <p className="reveal text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-xl mx-auto">
            Start a play-along session with Aaroh AI and feel the difference in
            your practice within one song.
          </p>
          <div className="reveal flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handlePlayAlongClick}
              className="relative overflow-hidden px-8 py-3.5 bg-primary text-white text-base font-semibold rounded-xl shadow-lg shadow-primary/30 hover:scale-[1.02] transition-transform duration-300"
            >
              <span className="relative z-10">Try Play-Along Demo</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;

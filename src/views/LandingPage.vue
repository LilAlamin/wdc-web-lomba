<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Scroll animation
const isVisible = ref({});
const observeElements = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value[entry.target.id] = true;
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll("[data-animate]").forEach((el) => {
    observer.observe(el);
  });
};

onMounted(() => {
  observeElements();
});

const goToLogin = () => {
  router.push("/login");
};

const features = [
  {
    icon: "calendar_today",
    title: "Smart Calendar",
    desc: "Kelola jadwal kuliah, deadline, dan kegiatan kampus dalam satu kalender interaktif yang powerful.",
    color: "bg-neo-pink",
    borderColor: "border-neo-pink",
  },
  {
    icon: "sticky_note_2",
    title: "Catatan Pintar",
    desc: "Buat, edit, dan organisir catatan kuliah dengan rich text editor. Tidak ada lagi catatan yang hilang!",
    color: "bg-neo-mint",
    borderColor: "border-neo-mint",
  },
  {
    icon: "assignment",
    title: "Tugas & Deadline",
    desc: "Track semua tugas dan deadline dalam satu tempat. Checklist, prioritas, dan reminder otomatis.",
    color: "bg-neo-orange",
    borderColor: "border-neo-orange",
  },
  {
    icon: "psychology",
    title: "Lumina AI",
    desc: "Asisten AI pribadi yang bantu kamu belajar, merangkum materi, dan menjawab pertanyaan akademik.",
    color: "bg-neo-blue",
    borderColor: "border-neo-blue",
  },
  {
    icon: "emoji_events",
    title: "Achievements & Profil",
    desc: "Gamifikasi perjalanan akademikmu. Raih achievement, bangun streak, dan pantau progress belajar.",
    color: "bg-primary",
    borderColor: "border-primary",
  },
];

const steps = [
  {
    num: "01",
    title: "Daftar / Login",
    desc: "Buat akun gratis atau login untuk mulai mengatur kehidupan akademikmu.",
    color: "bg-neo-pink",
  },
  {
    num: "02",
    title: "Atur Jadwal",
    desc: "Tambahkan jadwal kuliah, deadline tugas, dan kegiatan kampus ke kalender.",
    color: "bg-neo-mint",
  },
  {
    num: "03",
    title: "Catat & Kerjakan",
    desc: "Buat catatan kuliah, track tugas, dan gunakan AI untuk bantu belajar.",
    color: "bg-neo-orange",
  },
  {
    num: "04",
    title: "Raih Achievement!",
    desc: "Konsisten belajar, raih streak, dan unlock achievement spesial.",
    color: "bg-primary",
  },
];

// Floating shapes animation
const shapes = ref([]);
for (let i = 0; i < 12; i++) {
  shapes.value.push({
    id: i,
    size: Math.random() * 60 + 20,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10,
    type: ["circle", "square", "triangle"][Math.floor(Math.random() * 3)],
    color: ["#ff6bdf", "#00ff9d", "#ff8c00", "#00d0ff", "#f9f906"][
      Math.floor(Math.random() * 5)
    ],
  });
}
</script>

<template>
  <div class="relative overflow-hidden">
    <!-- ============ NAVBAR ============ -->
    <nav
      class="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 bg-white border-b-4 border-black shadow-neo"
    >
      <div class="flex items-center gap-3">
        <div
          class="flex size-10 items-center justify-center bg-primary border-4 border-black rounded shadow-neo"
        >
          <span class="material-symbols-outlined font-black text-black"
            >auto_stories</span
          >
        </div>
        <h1 class="text-lg md:text-xl font-black uppercase tracking-wider">
          Buku Sakti
        </h1>
      </div>
      <div class="hidden md:flex items-center gap-6">
        <a
          href="#features"
          class="text-sm font-bold uppercase tracking-widest hover:text-neo-pink transition-colors"
          >Fitur</a
        >
        <a
          href="#how-it-works"
          class="text-sm font-bold uppercase tracking-widest hover:text-neo-pink transition-colors"
          >Cara Kerja</a
        >
        <a
          href="#cta"
          class="text-sm font-bold uppercase tracking-widest hover:text-neo-pink transition-colors"
          >Mulai</a
        >
      </div>
      <button
        @click="goToLogin"
        class="px-6 py-2 bg-primary border-4 border-black font-black uppercase text-sm shadow-neo hover:shadow-neo-hover hover:translate-y-1 hover:translate-x-1 transition-all cursor-pointer"
      >
        Login
      </button>
    </nav>

    <!-- ============ HERO SECTION ============ -->
    <section
      class="relative min-h-[90vh] flex items-center px-6 md:px-10 py-16 lg:py-20 bg-background-light overflow-hidden"
    >
      <!-- Floating decorative shapes -->
      <div
        v-for="shape in shapes"
        :key="shape.id"
        class="absolute pointer-events-none opacity-20"
        :style="{
          left: shape.x + '%',
          top: shape.y + '%',
          width: shape.size + 'px',
          height: shape.size + 'px',
          backgroundColor: shape.type !== 'triangle' ? shape.color : 'transparent',
          borderRadius: shape.type === 'circle' ? '50%' : '0',
          border: '3px solid ' + shape.color,
          animation: `float ${shape.duration}s ease-in-out ${shape.delay}s infinite alternate`,
          transform: shape.type === 'triangle' ? 'rotate(45deg)' : '',
        }"
      ></div>

      <!-- Large decorative elements -->
      <div
        class="absolute -top-20 -right-20 w-80 h-80 bg-neo-pink rounded-full opacity-10 blur-3xl"
      ></div>
      <div
        class="absolute -bottom-32 -left-32 w-96 h-96 bg-neo-blue rounded-full opacity-10 blur-3xl"
      ></div>

      <div class="relative z-10 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        <!-- Left: Text Content -->
        <div class="flex-1 text-center lg:text-left">
          <!-- Badge -->
          <div
            class="inline-flex items-center gap-2 mb-8 px-5 py-2 bg-neo-mint border-4 border-black shadow-neo font-bold uppercase text-sm text-black animate-bounce"
          >
            <span class="material-symbols-outlined text-lg font-bold">bolt</span>
            Platform Mahasiswa #1
          </div>

          <!-- Title -->
          <h1
            class="text-5xl md:text-7xl lg:text-7xl xl:text-8xl font-black uppercase leading-[0.95] tracking-tighter mb-6"
          >
            <span class="block">Buku Sakti</span>
            <span
              class="block text-transparent bg-clip-text"
              style="
                background-image: linear-gradient(
                  90deg,
                  #ff6bdf,
                  #00d0ff,
                  #f9f906
                );
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
              "
              >Mahasiswa</span
            >
          </h1>

          <!-- Subtitle -->
          <p
            class="text-lg md:text-xl font-bold text-gray-700 max-w-2xl mb-10 leading-relaxed"
          >
            Satu platform untuk kelola
            <span
              class="bg-neo-pink px-2 py-0.5 border-2 border-black text-black inline-block transform -rotate-1"
              >jadwal</span
            >,
            <span
              class="bg-neo-mint px-2 py-0.5 border-2 border-black text-black inline-block transform rotate-1"
              >catatan</span
            >,
            <span
              class="bg-neo-orange px-2 py-0.5 border-2 border-black text-black inline-block transform -rotate-1"
              >tugas</span
            >, dan
            <span
              class="bg-neo-blue px-2 py-0.5 border-2 border-black text-black inline-block transform rotate-1"
              >belajar</span
            >
            dengan bantuan AI
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row items-center lg:items-start gap-4">
            <button
              @click="goToLogin"
              class="px-10 py-4 bg-primary border-4 border-black font-black uppercase text-lg shadow-neo hover:shadow-neo-hover hover:translate-y-1 hover:translate-x-1 transition-all flex items-center gap-3 cursor-pointer"
            >
              Mulai Sekarang
              <span class="material-symbols-outlined font-black text-2xl"
                >arrow_forward</span
              >
            </button>
            <a
              href="#features"
              class="px-10 py-4 bg-white border-4 border-black font-black uppercase text-lg shadow-neo hover:shadow-neo-hover hover:translate-y-1 hover:translate-x-1 transition-all flex items-center gap-3 cursor-pointer"
            >
              Lihat Fitur
              <span class="material-symbols-outlined font-black text-2xl"
                >expand_more</span
              >
            </a>
          </div>

          <!-- Stats row -->
          <div
            class="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-12"
          >
            <div
              class="flex items-center gap-3 px-5 py-3 bg-white border-4 border-black shadow-neo"
            >
              <span
                class="material-symbols-outlined text-neo-pink font-bold text-3xl"
                >groups</span
              >
              <div class="text-left">
                <p class="text-2xl font-black">10K+</p>
                <p class="text-xs font-bold uppercase text-gray-500">
                  Mahasiswa Aktif
                </p>
              </div>
            </div>
            <div
              class="flex items-center gap-3 px-5 py-3 bg-white border-4 border-black shadow-neo"
            >
              <span
                class="material-symbols-outlined text-neo-mint font-bold text-3xl"
                >school</span
              >
              <div class="text-left">
                <p class="text-2xl font-black">50+</p>
                <p class="text-xs font-bold uppercase text-gray-500">
                  Universitas
                </p>
              </div>
            </div>
            <div
              class="flex items-center gap-3 px-5 py-3 bg-white border-4 border-black shadow-neo"
            >
              <span
                class="material-symbols-outlined text-neo-orange font-bold text-3xl"
                >star</span
              >
              <div class="text-left">
                <p class="text-2xl font-black">4.9/5</p>
                <p class="text-xs font-bold uppercase text-gray-500">Rating</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Illustration -->
        <div class="flex-1 flex items-center justify-center relative">
          <!-- Background decorative card behind illustration -->
          <div class="absolute w-[90%] h-[90%] bg-neo-pink border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-3xl rotate-3 top-4 left-4"></div>
          <div class="absolute w-[85%] h-[85%] bg-neo-mint border-4 border-black shadow-neo rounded-3xl -rotate-2 top-8 right-4"></div>

          <!-- Main illustration -->
          <div class="relative z-10 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-3xl p-4 transform hover:-rotate-1 hover:scale-[1.02] transition-all duration-300">
            <img
              src="/images/student-laptop.png"
              alt="Mahasiswa sedang belajar"
              class="w-full max-w-md h-auto object-contain"
            />
          </div>

          <!-- Floating mini badges -->
          <div class="absolute -top-4 -right-2 bg-primary border-4 border-black shadow-neo px-3 py-2 font-black text-sm rotate-6 z-20 hidden md:flex items-center gap-1 animate-bounce" style="animation-delay: 0.5s;">
            <span class="material-symbols-outlined text-lg font-bold">local_fire_department</span>
            Streak 12!
          </div>
          <div class="absolute -bottom-2 -left-2 bg-neo-blue border-4 border-black shadow-neo px-3 py-2 font-black text-sm -rotate-3 z-20 hidden md:flex items-center gap-1">
            <span class="material-symbols-outlined text-lg font-bold">emoji_events</span>
            A+ Grade
          </div>
          <div class="absolute top-1/2 -right-6 bg-neo-orange border-4 border-black shadow-neo px-3 py-2 font-black text-xs rotate-3 z-20 hidden lg:flex items-center gap-1">
            <span class="material-symbols-outlined text-base font-bold">check_circle</span>
            5 Tasks Done
          </div>
        </div>
      </div>
    </section>

    <!-- ============ FEATURES SECTION ============ -->
    <section
      id="features"
      class="px-6 md:px-10 py-20 bg-white border-t-4 border-black"
    >
      <div class="max-w-6xl mx-auto">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <div
            class="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-neo-blue border-4 border-black shadow-neo font-bold uppercase text-sm text-black"
          >
            <span class="material-symbols-outlined font-bold">apps</span>
            Fitur Unggulan
          </div>
          <h2
            class="text-4xl md:text-6xl font-black uppercase tracking-tighter"
          >
            Semua yang Kamu
            <span class="text-neo-pink">Butuhkan</span>
          </h2>
          <p class="mt-4 text-lg font-bold text-gray-600 max-w-2xl mx-auto">
            Tool lengkap untuk mendukung perjalanan akademik mahasiswa, dari catatan sampai AI assistant.
          </p>
        </div>

        <!-- Feature Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(feature, idx) in features"
            :key="idx"
            :id="'feature-' + idx"
            data-animate
            :class="[
              'group p-8 border-4 border-black shadow-neo hover:shadow-neo-hover hover:translate-y-1 hover:translate-x-1 transition-all cursor-pointer bg-white',
              isVisible['feature-' + idx]
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0',
            ]"
            :style="{
              transition: 'all 0.5s ease ' + idx * 0.1 + 's',
            }"
          >
            <!-- Icon -->
            <div
              :class="[
                'w-16 h-16 flex items-center justify-center border-4 border-black shadow-neo mb-6',
                feature.color,
              ]"
            >
              <span class="material-symbols-outlined text-3xl font-black text-black">{{
                feature.icon
              }}</span>
            </div>

            <!-- Content -->
            <h3
              class="text-2xl font-black uppercase mb-3 group-hover:text-neo-pink transition-colors"
            >
              {{ feature.title }}
            </h3>
            <p class="font-bold text-gray-600 leading-relaxed">
              {{ feature.desc }}
            </p>

            <!-- Arrow -->
            <div class="mt-6 flex items-center gap-2 text-sm font-black uppercase text-gray-400 group-hover:text-black transition-colors">
              <span>Selengkapnya</span>
              <span class="material-symbols-outlined text-lg font-bold group-hover:translate-x-2 transition-transform">arrow_forward</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ HOW IT WORKS ============ -->
    <section
      id="how-it-works"
      class="px-6 md:px-10 py-20 bg-background-light border-t-4 border-black"
    >
      <div class="max-w-5xl mx-auto">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <div
            class="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-neo-orange border-4 border-black shadow-neo font-bold uppercase text-sm text-black"
          >
            <span class="material-symbols-outlined font-bold">route</span>
            Cara Kerja
          </div>
          <h2
            class="text-4xl md:text-6xl font-black uppercase tracking-tighter"
          >
            Mudah <span class="text-neo-blue">Banget!</span>
          </h2>
          <!-- Student Book Illustration -->
          <div class="mt-8 flex justify-center">
            <div class="relative inline-block">
              <div class="bg-neo-mint border-4 border-black shadow-neo rounded-2xl p-3 inline-block transform -rotate-2 hover:rotate-0 transition-all duration-300">
                <img
                  src="/images/student-book.png"
                  alt="Mahasiswa membaca buku"
                  class="w-40 md:w-52 h-auto object-contain"
                />
              </div>
              <div class="absolute -top-3 -right-3 bg-primary border-3 border-black shadow-neo px-2 py-1 font-black text-xs rotate-6 z-10">
                Easy! ✨
              </div>
            </div>
          </div>
        </div>

        <!-- Steps -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="(step, idx) in steps"
            :key="idx"
            :id="'step-' + idx"
            data-animate
            class="relative group"
          >
            <!-- Connector line (hidden on mobile, visible on lg) -->
            <div
              v-if="idx < steps.length - 1"
              class="hidden lg:block absolute top-8 left-full w-6 h-1 bg-black z-10"
            ></div>

            <div
              :class="[
                'p-6 border-4 border-black shadow-neo bg-white hover:shadow-neo-hover hover:translate-y-1 hover:translate-x-1 transition-all h-full',
                isVisible['step-' + idx]
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0',
              ]"
              :style="{ transition: 'all 0.5s ease ' + idx * 0.15 + 's' }"
            >
              <!-- Step Number -->
              <div
                :class="[
                  'w-14 h-14 flex items-center justify-center border-4 border-black shadow-neo mb-4 font-black text-2xl text-black',
                  step.color,
                ]"
              >
                {{ step.num }}
              </div>

              <h3 class="text-xl font-black uppercase mb-2">
                {{ step.title }}
              </h3>
              <p class="font-bold text-gray-600 text-sm leading-relaxed">
                {{ step.desc }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ SHOWCASE / PREVIEW SECTION ============ -->
    <section class="px-6 md:px-10 py-20 bg-white border-t-4 border-black">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12">
          <h2
            class="text-4xl md:text-6xl font-black uppercase tracking-tighter"
          >
            Intip <span class="text-neo-mint">Dashboard</span> nya
          </h2>
          <p class="mt-4 text-lg font-bold text-gray-600">
            Interface neobrutalism yang bold, fun, dan eye-catching!
          </p>
        </div>

        <!-- Preview Mock -->
        <div
          class="relative border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden rounded-xl"
        >
          <!-- Mock browser bar -->
          <div
            class="flex items-center gap-3 px-4 py-3 border-b-4 border-black bg-gray-100"
          >
            <div class="flex gap-2">
              <div
                class="w-4 h-4 rounded-full bg-red-400 border-2 border-black"
              ></div>
              <div
                class="w-4 h-4 rounded-full bg-yellow-400 border-2 border-black"
              ></div>
              <div
                class="w-4 h-4 rounded-full bg-green-400 border-2 border-black"
              ></div>
            </div>
            <div
              class="flex-1 ml-4 bg-white border-2 border-black px-4 py-1 font-bold text-sm text-gray-500"
            >
              bukusakti.app/dashboard
            </div>
          </div>

          <!-- Mock dashboard content -->
          <div class="p-6 bg-background-light">
            <div class="grid grid-cols-12 gap-4">
              <!-- Mock sidebar nav -->
              <div class="col-span-12 flex gap-3 mb-4">
                <div
                  class="px-4 py-2 bg-neo-pink border-2 border-black shadow-neo font-bold text-xs uppercase"
                >
                  Dashboard
                </div>
                <div
                  class="px-4 py-2 bg-white border-2 border-black font-bold text-xs uppercase"
                >
                  Notes
                </div>
                <div
                  class="px-4 py-2 bg-white border-2 border-black font-bold text-xs uppercase"
                >
                  Tugas
                </div>
                <div
                  class="px-4 py-2 bg-white border-2 border-black font-bold text-xs uppercase"
                >
                  AI
                </div>
              </div>

              <!-- Mock calendar -->
              <div
                class="col-span-12 lg:col-span-8 bg-white border-4 border-black shadow-neo p-4"
              >
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-xl font-black uppercase">March 2026</h3>
                  <div class="flex gap-2">
                    <div
                      class="w-8 h-8 bg-neo-blue border-2 border-black flex items-center justify-center"
                    >
                      <span class="material-symbols-outlined text-sm text-black font-bold"
                        >arrow_back</span
                      >
                    </div>
                    <div
                      class="w-8 h-8 bg-neo-pink border-2 border-black flex items-center justify-center"
                    >
                      <span class="material-symbols-outlined text-sm text-black font-bold"
                        >arrow_forward</span
                      >
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-7 gap-1">
                  <div
                    v-for="d in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
                    :key="d"
                    class="py-2 text-center font-black text-xs uppercase border-b-2 border-black"
                  >
                    {{ d }}
                  </div>
                  <div
                    v-for="i in 35"
                    :key="i"
                    :class="[
                      'aspect-square border border-gray-200 flex flex-col items-center justify-center text-xs font-bold relative',
                      i === 8
                        ? 'bg-primary border-2 border-black'
                        : '',
                    ]"
                  >
                    <span>{{ ((i + 5) % 31) + 1 }}</span>
                    <div
                      v-if="[3, 7, 12, 18, 25].includes(i)"
                      :class="[
                        'w-4/5 h-1 mt-1 border border-black',
                        i === 3
                          ? 'bg-neo-pink'
                          : i === 7
                            ? 'bg-neo-mint'
                            : i === 12
                              ? 'bg-neo-orange'
                              : i === 18
                                ? 'bg-neo-blue'
                                : 'bg-primary',
                      ]"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Mock sidebar -->
              <div class="col-span-12 lg:col-span-4 flex flex-col gap-4">
                <div
                  class="bg-white border-4 border-black shadow-neo p-4"
                >
                  <h4 class="font-black uppercase text-sm mb-3 border-b-2 border-black pb-2">
                    Deadlines
                  </h4>
                  <div class="flex flex-col gap-2">
                    <div
                      class="flex items-center gap-2 p-2 border-2 border-black bg-background-light"
                    >
                      <div
                        class="w-4 h-4 border-2 border-black rounded-sm"
                      ></div>
                      <span class="font-bold text-xs">CS301 Midterm</span>
                    </div>
                    <div
                      class="flex items-center gap-2 p-2 border-2 border-black bg-background-light"
                    >
                      <div
                        class="w-4 h-4 border-2 border-black rounded-sm"
                      ></div>
                      <span class="font-bold text-xs">History Essay</span>
                    </div>
                  </div>
                </div>

                <!-- Mock streak -->
                <div
                  class="bg-gradient-to-br from-orange-400 via-red-500 to-yellow-400 border-4 border-black shadow-neo p-4 text-white"
                >
                  <h4 class="font-black uppercase text-sm">Study Streak</h4>
                  <div class="flex items-center gap-2 mt-2">
                    <span
                      class="material-symbols-outlined text-4xl text-yellow-200 font-bold"
                      >local_fire_department</span
                    >
                    <span class="text-4xl font-black">12</span>
                    <span class="font-bold text-xs uppercase text-yellow-100"
                      >Days</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ CTA SECTION ============ -->
    <section
      id="cta"
      class="px-6 md:px-10 py-20 bg-black text-white border-t-4 border-black relative overflow-hidden"
    >
      <!-- Decorative -->
      <div
        class="absolute top-0 right-0 w-64 h-64 bg-neo-pink opacity-20 blur-3xl"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-64 h-64 bg-neo-blue opacity-20 blur-3xl"
      ></div>

      <div class="max-w-5xl mx-auto relative z-10">
        <!-- Student Graduate Illustrations on sides -->
        <div class="hidden lg:block absolute -left-32 bottom-0 z-10">
          <div class="bg-neo-mint border-4 border-black shadow-neo rounded-2xl p-2 transform rotate-3 hover:-rotate-1 transition-all duration-300">
            <img
              src="/images/student-graduate.png"
              alt="Mahasiswa wisuda"
              class="w-36 h-auto object-contain"
            />
          </div>
        </div>

        <div class="text-center">
          <div
            class="inline-flex items-center gap-2 mb-6 px-5 py-2 bg-primary border-4 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] font-bold uppercase text-sm text-black"
          >
            <span class="material-symbols-outlined font-bold text-lg"
              >rocket_launch</span
            >
            Gratis Selamanya
          </div>

          <h2
            class="text-4xl md:text-6xl font-black uppercase leading-tight tracking-tighter mb-6"
          >
            Siap Upgrade Kehidupan
            <span
              class="text-transparent"
              style="
                background-image: linear-gradient(
                  90deg,
                  #ff6bdf,
                  #00d0ff,
                  #f9f906
                );
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
              "
              >Akademikmu?</span
            >
          </h2>

          <p class="text-lg font-bold text-gray-300 max-w-2xl mx-auto mb-10">
            Join ribuan mahasiswa yang udah pakai Buku Sakti untuk mengelola
            jadwal, catatan, dan tugas mereka. Jangan sampai ketinggalan!
          </p>

          <button
            @click="goToLogin"
            class="px-12 py-5 bg-primary border-4 border-white font-black uppercase text-xl text-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:translate-y-1 hover:translate-x-1 transition-all flex items-center gap-3 mx-auto cursor-pointer"
          >
            Masuk Sekarang
            <span class="material-symbols-outlined font-black text-2xl"
              >arrow_forward</span
            >
          </button>
        </div>

        <!-- Right Graduate Illustration -->
        <div class="hidden lg:block absolute -right-32 bottom-0 z-10">
          <div class="bg-neo-pink border-4 border-black shadow-neo rounded-2xl p-2 transform -rotate-3 hover:rotate-1 transition-all duration-300">
            <img
              src="/images/student-book.png"
              alt="Mahasiswa belajar"
              class="w-36 h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- ============ FOOTER ============ -->
    <footer
      class="px-6 md:px-10 py-10 bg-white border-t-4 border-black"
    >
      <div class="max-w-6xl mx-auto">
        <div
          class="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex size-10 items-center justify-center bg-primary border-4 border-black rounded shadow-neo"
            >
              <span
                class="material-symbols-outlined font-black text-black"
                >auto_stories</span
              >
            </div>
            <h2 class="text-lg font-black uppercase tracking-wider">
              Buku Sakti Mahasiswa
            </h2>
          </div>

          <div class="flex items-center gap-6">
            <a
              href="#features"
              class="text-sm font-bold uppercase hover:text-neo-pink transition-colors"
              >Fitur</a
            >
            <a
              href="#how-it-works"
              class="text-sm font-bold uppercase hover:text-neo-pink transition-colors"
              >Cara Kerja</a
            >
            <button
              @click="goToLogin"
              class="text-sm font-bold uppercase hover:text-neo-pink transition-colors cursor-pointer"
            >
              Login
            </button>
          </div>

          <p class="text-sm font-bold text-gray-500">
            © 2026 Buku Sakti Mahasiswa. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@keyframes float {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  100% {
    transform: translateY(-30px) rotate(10deg);
  }
}
</style>

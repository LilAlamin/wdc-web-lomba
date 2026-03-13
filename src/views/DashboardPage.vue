<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import NoteView from "../components/NoteView.vue";
import ProfileView from "../components/ProfileView.vue";
import AchievementsView from "../components/AchievementsView.vue";
import AssignmentsView from "../components/AssignmentsView.vue";
import AiAssistantView from "../components/AiAssistantView.vue";
import FocusView from "../components/FocusView.vue";

const router = useRouter();

const handleLogout = () => {
  sessionStorage.removeItem("isLoggedIn");
  router.push("/");
};

// --- Mobile Menu ---
const mobileMenuOpen = ref(false);
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

// --- View State Management ---
const activeView = ref(
  window.location.hash.includes("notes")
    ? "notes"
    : window.location.hash.includes("achievements")
      ? "achievements"
      : window.location.hash.includes("profile")
        ? "profile"
        : window.location.hash.includes("assignments")
          ? "assignments"
          : window.location.hash.includes("focus")
            ? "focus"
            : window.location.hash.includes("ai")
              ? "ai"
              : "calendar",
);

const toggleView = (view) => {
  activeView.value = view;
  mobileMenuOpen.value = false;
  if (view === "notes") {
    window.location.hash = "notes";
  } else if (view === "profile") {
    window.location.hash = "profile";
  } else if (view === "achievements") {
    window.location.hash = "achievements";
  } else if (view === "assignments") {
    window.location.hash = "assignments";
  } else if (view === "focus") {
    window.location.hash = "focus";
  } else if (view === "ai") {
    window.location.hash = "ai";
  } else {
    window.location.hash = "";
  }
};

const handleHashChange = () => {
  activeView.value = window.location.hash.includes("notes")
    ? "notes"
    : window.location.hash.includes("achievements")
      ? "achievements"
      : window.location.hash.includes("profile")
        ? "profile"
        : window.location.hash.includes("assignments")
          ? "assignments"
          : window.location.hash.includes("focus")
            ? "focus"
            : window.location.hash.includes("ai")
              ? "ai"
              : "calendar";
};

onMounted(() => {
  window.addEventListener("hashchange", handleHashChange);
});

onUnmounted(() => {
  window.removeEventListener("hashchange", handleHashChange);
});

// --- Current Date Management ---
const currentMonthIndex = ref(2); // 0-11 (March)
const currentYear = ref(2026);

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentMonthName = computed(() => monthNames[currentMonthIndex.value]);

const prevMonth = () => {
  if (currentMonthIndex.value === 0) {
    currentMonthIndex.value = 11;
    currentYear.value--;
  } else {
    currentMonthIndex.value--;
  }
};

const nextMonth = () => {
  if (currentMonthIndex.value === 11) {
    currentMonthIndex.value = 0;
    currentYear.value++;
  } else {
    currentMonthIndex.value++;
  }
};

// --- Dummy Events Data ---
const events = ref([
  {
    date: "2026-03-02",
    title: "CS301 Lecture",
    color: "bg-neo-pink",
    time: "10:00 AM - 11:30 AM",
    location: "Room 204, Science Building",
    description:
      "Introduction to Graph Algorithms. Please bring your textbook and complete the pre-lecture reading on BFS/DFS.",
  },
  {
    date: "2026-03-04",
    title: "Study Group",
    color: "bg-neo-mint",
    time: "3:00 PM - 5:00 PM",
    location: "Library, Study Room 3B",
    description:
      "Group study session for the upcoming CS301 midterm. Focus on dynamic programming and greedy algorithms.",
  },
  {
    date: "2026-03-07",
    title: "CS301 Lecture",
    color: "bg-neo-pink",
    time: "10:00 AM - 11:30 AM",
    location: "Room 204, Science Building",
    description:
      "Midterm review lecture. Covering all major topics from the first half of the semester.",
  },
  {
    date: "2026-03-07",
    title: "Hist Essay Due",
    color: "bg-neo-orange",
    time: "11:59 PM",
    location: "Online Submission",
    description:
      "Submit your History 202 essay on the causes and consequences of the Cold War. Minimum 2000 words.",
  },
  {
    date: "2026-03-09",
    title: "Math Lab",
    color: "bg-neo-blue",
    time: "2:00 PM - 4:00 PM",
    location: "Math Center, Room 101",
    description:
      "Hands-on practice with linear algebra problems. Bring your calculator and problem set worksheet.",
  },
  {
    date: "2026-03-10",
    title: "Design Review",
    color: "bg-white",
    time: "1:00 PM - 2:30 PM",
    location: "Design Studio, Floor 3",
    description:
      "Present your mid-semester design project. Prepare a 10-minute presentation with mockups.",
  },
  {
    date: "2026-03-16",
    title: "CS301 Midterm",
    color: "bg-neo-pink",
    time: "9:00 AM - 12:00 PM",
    location: "Exam Hall A",
    description:
      "Midterm examination covering chapters 1-8. Closed book, no electronic devices allowed.",
  },
  {
    date: "2026-03-20",
    title: "Spring Festival",
    color: "bg-neo-mint",
    time: "All Day",
    location: "Campus-wide",
    description:
      "Annual spring festival with food stalls, music performances, and student club exhibitions.",
  },
  {
    date: "2026-03-25",
    title: "Project Deadline",
    color: "bg-neo-orange",
    time: "11:59 PM",
    location: "Online Submission",
    description: "Submit your group project for CS301. Include source code and documentation.",
  },
  {
    date: "2026-03-28",
    title: "Workshop",
    color: "bg-neo-blue",
    time: "1:00 PM - 4:00 PM",
    location: "Tech Lab, Room 305",
    description: "Hands-on workshop on web development with modern frameworks.",
  },
]);

// --- Event Detail Modal ---
const selectedEvent = ref(null);

const openEventDetail = (event) => {
  selectedEvent.value = event;
};

const closeEventDetail = () => {
  selectedEvent.value = null;
};

// --- Create Event Modal ---
const showCreateModal = ref(false);
const newEvent = ref({
  title: "",
  date: "",
  startTime: "",
  endTime: "",
  location: "",
  description: "",
  color: "bg-neo-pink",
});

const colorOptions = [
  { value: "bg-neo-pink", label: "Lectures", hex: "#ff6bdf" },
  { value: "bg-neo-mint", label: "Activities", hex: "#00ff9d" },
  { value: "bg-neo-orange", label: "Deadlines", hex: "#ff8c00" },
  { value: "bg-neo-blue", label: "Labs & Workshops", hex: "#00d0ff" },
  { value: "bg-primary", label: "Personal", hex: "#f9f906" },
  { value: "bg-white", label: "Other", hex: "#ffffff" },
];

const formatTime = (time24) => {
  if (!time24) return "";
  const [h, m] = time24.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
};

const openCreateModal = () => {
  newEvent.value = {
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    description: "",
    color: "bg-neo-pink",
  };
  showCreateModal.value = true;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
};

const createEvent = () => {
  if (!newEvent.value.title || !newEvent.value.date) {
    return;
  }
  // Build display time string
  let timeStr = "";
  if (newEvent.value.startTime && newEvent.value.endTime) {
    timeStr = `${formatTime(newEvent.value.startTime)} - ${formatTime(newEvent.value.endTime)}`;
  } else if (newEvent.value.startTime) {
    timeStr = formatTime(newEvent.value.startTime);
  }

  const eventData = {
    title: newEvent.value.title,
    date: newEvent.value.date,
    time: timeStr,
    location: newEvent.value.location,
    description: newEvent.value.description,
    color: newEvent.value.color,
  };
  events.value.push(eventData);

  closeCreateModal();
};

// --- Generate Calendar Grid ---
const calendarDays = computed(() => {
  const year = currentYear.value;
  const month = currentMonthIndex.value;

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const days = [];

  // Previous month overflow
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({
      date: daysInPrevMonth - i,
      month: "prev",
      isToday: false,
      events: [],
    });
  }

  // Current month
  const today = new Date();
  const todayIndo = new Date(today.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
  const todayYear = todayIndo.getFullYear();
  const todayMonth = todayIndo.getMonth();
  const todayDate = todayIndo.getDate();
  for (let i = 1; i <= daysInMonth; i++) {
    const defaultDateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
    const dayEvents = filteredEvents.value.filter((e) => e.date === defaultDateStr);
    const isToday = year === todayYear && month === todayMonth && i === todayDate;

    days.push({
      date: i,
      month: "current",
      isToday: isToday,
      events: dayEvents,
      isSpecial: month === 2 && (i === 20 || i === 28), // Making Spring Festival & Workshop special
    });
  }

  // Next month overflow to fill exactly 35 or 42 grid cells
  const totalCells = days.length > 35 ? 42 : 35;
  const remainingDays = totalCells - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: i,
      month: "next",
      isToday: false,
      events: [],
    });
  }

  return days;
});

// --- Todo / Deadlines ---
const deadlines = ref([
  {
    id: 1,
    title: "CS301 Midterm Prep",
    time: "Mar 16, 9:00 AM",
    done: false,
    hoverColor: "hover:bg-primary/20",
  },
  {
    id: 2,
    title: "History 202 Essay",
    time: "Mar 7, 11:59 PM",
    done: false,
    hoverColor: "hover:bg-neo-mint/20",
  },
  {
    id: 3,
    title: "CS301 Group Project",
    time: "Mar 25, 11:59 PM",
    done: false,
    hoverColor: "hover:bg-neo-blue/20",
  },
]);

// Actions
// --- Filter Feature ---
const showFilterPanel = ref(false);
const activeFilters = ref([
  "bg-neo-pink",
  "bg-neo-mint",
  "bg-neo-orange",
  "bg-neo-blue",
  "bg-primary",
  "bg-white",
  "bg-gray-200",
]);
const searchQuery = ref("");

const toggleFilter = (color) => {
  const idx = activeFilters.value.indexOf(color);
  if (idx > -1) {
    activeFilters.value.splice(idx, 1);
  } else {
    activeFilters.value.push(color);
  }
};

const resetFilters = () => {
  activeFilters.value = [
    "bg-neo-pink",
    "bg-neo-mint",
    "bg-neo-orange",
    "bg-neo-blue",
    "bg-primary",
    "bg-white",
    "bg-gray-200",
  ];
  searchQuery.value = "";
};

const filteredEvents = computed(() => {
  return events.value.filter((e) => {
    const matchesColor = activeFilters.value.includes(e.color);
    const matchesSearch =
      !searchQuery.value ||
      e.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (e.description && e.description.toLowerCase().includes(searchQuery.value.toLowerCase()));
    return matchesColor && matchesSearch;
  });
});
</script>

<template>
  <div class="relative flex h-auto min-h-screen w-full flex-col">
    <!-- TopNavBar -->
    <header
      class="border-b-4 border-black px-4 md:px-10 py-3 md:py-4 bg-white dark:bg-slate-900 shadow-neo mb-4 md:mb-6 sticky top-0 z-50"
    >
      <!-- Main navbar row -->
      <div class="flex items-center justify-between">
        <!-- Left: Logo + Desktop Nav -->
        <div class="flex items-center gap-4 md:gap-8 min-w-0">
          <div
            class="flex items-center gap-2 md:gap-4 cursor-pointer flex-shrink-0"
            @click="toggleView('calendar')"
          >
            <div
              class="flex size-8 md:size-10 items-center justify-center bg-primary border-3 md:border-4 border-black rounded shadow-neo"
            >
              <span class="material-symbols-outlined font-black text-sm md:text-base"
                >calendar_today</span
              >
            </div>
            <h2
              class="text-xs sm:text-sm md:text-xl font-black uppercase tracking-wider border-b-2 border-black"
            >
              Buku Sakti Mahasiswa
            </h2>
          </div>
          <div class="hidden lg:flex items-center gap-4">
            <a
              @click.prevent="toggleView('calendar')"
              :class="[
                'text-sm font-bold uppercase tracking-widest px-3 py-1 border-2 transition-all rounded cursor-pointer',
                activeView === 'calendar'
                  ? 'bg-neo-pink text-black border-black shadow-neo'
                  : 'border-transparent hover:border-black hover:shadow-neo hover:bg-neo-pink hover:text-black',
              ]"
              href="#"
              >Dashboard</a
            >
            <a
              @click.prevent="toggleView('notes')"
              :class="[
                'text-sm font-bold uppercase tracking-widest px-3 py-1 border-2 transition-all rounded cursor-pointer',
                activeView === 'notes'
                  ? 'bg-neo-mint text-black border-black shadow-neo'
                  : 'border-transparent hover:border-black hover:shadow-neo hover:bg-neo-mint hover:text-black',
              ]"
              href="#notes"
              >Notes</a
            >
            <a
              @click.prevent="toggleView('assignments')"
              :class="[
                'text-sm font-bold uppercase tracking-widest px-3 py-1 border-2 transition-all rounded cursor-pointer',
                activeView === 'assignments'
                  ? 'bg-neo-orange text-black border-black shadow-neo'
                  : 'border-transparent hover:border-black hover:shadow-neo hover:bg-neo-orange hover:text-black',
              ]"
              href="#assignments"
              >Assignments</a
            >
            <a
              @click.prevent="toggleView('focus')"
              :class="[
                'text-sm font-bold uppercase tracking-widest px-3 py-1 border-2 transition-all rounded cursor-pointer',
                activeView === 'focus'
                  ? 'bg-primary text-black border-black shadow-neo'
                  : 'border-transparent hover:border-black hover:shadow-neo hover:bg-primary hover:text-black',
              ]"
              href="#focus"
              >Focus</a
            >
            <a
              @click.prevent="toggleView('ai')"
              :class="[
                'text-sm font-bold uppercase tracking-widest px-3 py-1 border-2 transition-all rounded cursor-pointer',
                activeView === 'ai'
                  ? 'bg-neo-pink text-black border-black shadow-neo'
                  : 'text-neo-pink border-transparent hover:border-black hover:shadow-neo hover:bg-neo-pink hover:text-black',
              ]"
              href="#ai"
              >Lumina AI</a
            >
          </div>
        </div>

        <!-- Right: Search + Profile + Logout (Desktop) + Hamburger (Mobile) -->
        <div class="flex items-center gap-2 md:gap-4">
          <!-- Search (hidden on mobile) -->
          <div class="relative hidden md:flex items-center w-48 lg:w-64 group">
            <span
              class="material-symbols-outlined absolute left-3 text-black z-10 font-bold"
              >search</span
            >
            <input
              class="w-full bg-white dark:bg-slate-800 border-4 border-black rounded shadow-neo py-2 pl-10 pr-4 font-bold text-black placeholder:text-gray-500 focus:outline-none focus:ring-0 focus:shadow-neo-hover transition-all"
              placeholder="SEARCH..."
              type="text"
            />
          </div>
          <!-- Profile -->
          <div
            @click="toggleView('profile')"
            class="bg-neo-mint border-3 md:border-4 border-black shadow-neo aspect-square bg-cover rounded-full size-9 md:size-12 flex items-center justify-center cursor-pointer hover:shadow-neo-hover hover:-translate-y-1 transition-all"
          >
            <span class="material-symbols-outlined font-bold text-black text-sm md:text-base"
              >person</span
            >
          </div>
          <!-- Logout (hidden on mobile) -->
          <button
            @click="handleLogout"
            class="hidden md:flex items-center gap-2 px-4 py-2 bg-red-400 border-4 border-black font-bold uppercase text-sm text-black shadow-neo hover:shadow-neo-hover hover:translate-y-1 hover:translate-x-1 transition-all cursor-pointer"
          >
            <span class="material-symbols-outlined font-bold text-sm">logout</span>
            Logout
          </button>
          <!-- Hamburger (mobile only) -->
          <button
            @click="toggleMobileMenu"
            class="lg:hidden flex items-center justify-center size-10 border-3 border-black bg-white shadow-neo hover:shadow-neo-hover transition-all cursor-pointer"
          >
            <span class="material-symbols-outlined font-black text-black">{{
              mobileMenuOpen ? 'close' : 'menu'
            }}</span>
          </button>
        </div>
      </div>

      <!-- Mobile Menu Dropdown -->
      <div
        v-if="mobileMenuOpen"
        class="lg:hidden mt-4 border-t-4 border-black pt-4 flex flex-col gap-3"
      >
        <!-- Mobile Search -->
        <div class="relative flex items-center md:hidden">
          <span
            class="material-symbols-outlined absolute left-3 text-black z-10 font-bold"
            >search</span
          >
          <input
            class="w-full bg-white dark:bg-slate-800 border-3 border-black rounded shadow-neo py-2 pl-10 pr-4 font-bold text-black placeholder:text-gray-500 focus:outline-none focus:ring-0 focus:shadow-neo-hover transition-all text-sm"
            placeholder="SEARCH..."
            type="text"
          />
        </div>

        <!-- Mobile Nav Links -->
        <div class="flex flex-col gap-2">
          <a
            @click.prevent="toggleView('calendar')"
            :class="[
              'text-sm font-bold uppercase tracking-widest px-4 py-3 border-3 transition-all rounded cursor-pointer flex items-center gap-3',
              activeView === 'calendar'
                ? 'bg-neo-pink text-black border-black shadow-neo'
                : 'border-gray-200 hover:border-black hover:shadow-neo hover:bg-neo-pink hover:text-black',
            ]"
            href="#"
          >
            <span class="material-symbols-outlined font-bold text-lg">dashboard</span>
            Dashboard
          </a>
          <a
            @click.prevent="toggleView('notes')"
            :class="[
              'text-sm font-bold uppercase tracking-widest px-4 py-3 border-3 transition-all rounded cursor-pointer flex items-center gap-3',
              activeView === 'notes'
                ? 'bg-neo-mint text-black border-black shadow-neo'
                : 'border-gray-200 hover:border-black hover:shadow-neo hover:bg-neo-mint hover:text-black',
            ]"
            href="#notes"
          >
            <span class="material-symbols-outlined font-bold text-lg">sticky_note_2</span>
            Notes
          </a>
          <a
            @click.prevent="toggleView('assignments')"
            :class="[
              'text-sm font-bold uppercase tracking-widest px-4 py-3 border-3 transition-all rounded cursor-pointer flex items-center gap-3',
              activeView === 'assignments'
                ? 'bg-neo-orange text-black border-black shadow-neo'
                : 'border-gray-200 hover:border-black hover:shadow-neo hover:bg-neo-orange hover:text-black',
            ]"
            href="#assignments"
          >
            <span class="material-symbols-outlined font-bold text-lg">assignment</span>
            Assignments
          </a>
          <a
            @click.prevent="toggleView('focus')"
            :class="[
              'text-sm font-bold uppercase tracking-widest px-4 py-3 border-3 transition-all rounded cursor-pointer flex items-center gap-3',
              activeView === 'focus'
                ? 'bg-primary text-black border-black shadow-neo'
                : 'border-gray-200 hover:border-black hover:shadow-neo hover:bg-primary hover:text-black',
            ]"
            href="#focus"
          >
            <span class="material-symbols-outlined font-bold text-lg">timer</span>
            Focus
          </a>
          <a
            @click.prevent="toggleView('ai')"
            :class="[
              'text-sm font-bold uppercase tracking-widest px-4 py-3 border-3 transition-all rounded cursor-pointer flex items-center gap-3',
              activeView === 'ai'
                ? 'bg-neo-pink text-black border-black shadow-neo'
                : 'text-neo-pink border-gray-200 hover:border-black hover:shadow-neo hover:bg-neo-pink hover:text-black',
            ]"
            href="#ai"
          >
            <span class="material-symbols-outlined font-bold text-lg">psychology</span>
            Lumina AI
          </a>
        </div>

        <!-- Mobile Logout -->
        <button
          @click="handleLogout"
          class="md:hidden flex items-center justify-center gap-2 px-4 py-3 bg-red-400 border-3 border-black font-bold uppercase text-sm text-black shadow-neo hover:shadow-neo-hover hover:translate-y-1 hover:translate-x-1 transition-all cursor-pointer w-full"
        >
          <span class="material-symbols-outlined font-bold text-sm">logout</span>
          Logout
        </button>
      </div>
    </header>

    <!-- Render Main Calendar View conditionally -->
    <main
      v-if="activeView === 'calendar'"
      class="flex-1 flex flex-col lg:flex-row gap-4 md:gap-8 px-4 md:px-10 pb-6 md:pb-10 max-w-[1600px] mx-auto w-full"
    >
      <!-- Main Calendar Area -->
      <div class="flex-1 flex flex-col gap-6">
        <!-- Calendar Header -->
        <div
          class="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 border-4 border-black shadow-neo rounded-xl"
        >
          <div class="flex items-center gap-6">
            <button
              @click="prevMonth"
              class="size-10 md:size-12 rounded-full border-4 border-black bg-neo-blue shadow-neo hover:shadow-neo-hover hover:translate-y-1 hover:translate-x-1 flex items-center justify-center transition-all"
            >
              <span class="material-symbols-outlined font-black text-black"
                >arrow_back</span
              >
            </button>
            <h1 class="text-2xl md:text-5xl font-black uppercase tracking-tighter">
              {{ currentMonthName }} {{ currentYear }}
            </h1>
            <button
              @click="nextMonth"
              class="size-10 md:size-12 rounded-full border-4 border-black bg-neo-pink shadow-neo hover:shadow-neo-hover hover:translate-y-1 hover:translate-x-1 flex items-center justify-center transition-all"
            >
              <span class="material-symbols-outlined font-black text-black"
                >arrow_forward</span
              >
            </button>
          </div>
          <div class="flex flex-wrap gap-2 sm:gap-4">
            <div class="relative">
              <button
                @click="showFilterPanel = !showFilterPanel"
                :class="[
                  'flex items-center justify-center gap-2 border-4 border-black rounded px-4 md:px-6 py-2 md:py-3 font-bold uppercase text-sm shadow-neo hover:shadow-neo-hover hover:translate-y-1 hover:translate-x-1 transition-all',
                  activeFilters.length < 7 || searchQuery
                    ? 'bg-neo-orange text-black'
                    : 'bg-white dark:bg-slate-800',
                ]"
              >
                <span class="material-symbols-outlined font-bold"
                  >filter_list</span
                >
                Filter
                <span
                  v-if="activeFilters.length < 7 || searchQuery"
                  class="bg-black text-white text-xs font-black rounded-full w-5 h-5 flex items-center justify-center"
                >!</span>
              </button>

              <!-- Filter Dropdown -->
              <div
                v-if="showFilterPanel"
                class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:absolute sm:top-full sm:right-0 sm:left-auto sm:-translate-x-0 sm:-translate-y-0 sm:mt-2 w-[calc(100vw-2rem)] sm:w-72 bg-white dark:bg-slate-900 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] z-[60] flex flex-col"
              >
                <!-- Filter Header -->
                <div class="flex items-center justify-between border-b-4 border-black p-4 bg-neo-orange">
                  <h4 class="font-black uppercase text-sm text-black">Filter Events</h4>
                  <button
                    @click="showFilterPanel = false"
                    class="w-6 h-6 flex items-center justify-center bg-white border-2 border-black hover:shadow-neo transition-all"
                  >
                    <span class="material-symbols-outlined font-black text-black text-sm">close</span>
                  </button>
                </div>

                <!-- Search -->
                <div class="p-3 border-b-2 border-black">
                  <div class="relative">
                    <span class="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">search</span>
                    <input
                      v-model="searchQuery"
                      type="text"
                      placeholder="Search events..."
                      class="w-full border-2 border-black rounded py-2 pl-8 pr-3 text-sm font-bold bg-white dark:bg-slate-800 focus:outline-none focus:shadow-neo transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <!-- Color Filters -->
                <div class="p-3 flex flex-col gap-2">
                  <span class="font-black uppercase text-xs text-gray-500">By Category</span>
                  <label
                    v-for="color in [
                      { value: 'bg-neo-pink', label: 'Lectures', hex: '#ff6bdf' },
                      { value: 'bg-neo-mint', label: 'Activities', hex: '#00ff9d' },
                      { value: 'bg-neo-orange', label: 'Deadlines', hex: '#ff8c00' },
                      { value: 'bg-neo-blue', label: 'Labs & Workshops', hex: '#00d0ff' },
                      { value: 'bg-primary', label: 'Personal', hex: '#f9f906' },
                      { value: 'bg-white', label: 'Other', hex: '#ffffff' },
                    ]"
                    :key="color.value"
                    class="flex items-center gap-3 p-2 border-2 border-transparent hover:border-black rounded cursor-pointer transition-all group"
                  >
                    <input
                      type="checkbox"
                      :checked="activeFilters.includes(color.value)"
                      @change="toggleFilter(color.value)"
                      class="size-5 border-2 border-black rounded-sm text-black focus:ring-black focus:ring-offset-0 checked:bg-black transition-colors"
                    />
                    <div
                      class="w-4 h-4 border-2 border-black flex-shrink-0"
                      :style="{ backgroundColor: color.hex }"
                    ></div>
                    <span class="font-bold text-sm group-hover:underline">{{ color.label }}</span>
                  </label>
                </div>

                <!-- Filter Footer -->
                <div class="p-3 border-t-2 border-black flex justify-end">
                  <button
                    @click="resetFilters"
                    class="px-4 py-1 border-2 border-black bg-white font-bold text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] transition-all"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
            <button
              @click="openCreateModal"
              class="flex items-center justify-center gap-2 border-4 border-black rounded bg-primary text-black px-4 md:px-6 py-2 md:py-3 font-bold uppercase text-sm shadow-neo hover:shadow-neo-hover hover:translate-y-1 hover:translate-x-1 transition-all"
            >
              <span class="material-symbols-outlined font-bold">add</span>
              New Event
            </button>
          </div>
        </div>
        <!-- Calendar Grid -->
        <div
          class="bg-white dark:bg-slate-900 border-4 border-black shadow-neo rounded-xl overflow-hidden flex-1 flex flex-col"
        >
          <!-- Days of Week -->
          <div
            class="grid grid-cols-7 border-b-4 border-black bg-gray-100 dark:bg-slate-800"
          >
            <div class="py-2 md:py-4 text-center font-black uppercase text-xs md:text-base border-r-2 md:border-r-4 border-black">Sun</div>
            <div class="py-2 md:py-4 text-center font-black uppercase text-xs md:text-base border-r-2 md:border-r-4 border-black">Mon</div>
            <div class="py-2 md:py-4 text-center font-black uppercase text-xs md:text-base border-r-2 md:border-r-4 border-black">Tue</div>
            <div class="py-2 md:py-4 text-center font-black uppercase text-xs md:text-base border-r-2 md:border-r-4 border-black">Wed</div>
            <div class="py-2 md:py-4 text-center font-black uppercase text-xs md:text-base border-r-2 md:border-r-4 border-black">Thu</div>
            <div class="py-2 md:py-4 text-center font-black uppercase text-xs md:text-base border-r-2 md:border-r-4 border-black">Fri</div>
            <div class="py-2 md:py-4 text-center font-black uppercase text-xs md:text-base">Sat</div>
          </div>
          <!-- Dates Grid -->
          <div
            class="grid grid-cols-7 flex-1 bg-gray-50 dark:bg-slate-800/50"
            :class="calendarDays.length > 35 ? 'grid-rows-6' : 'grid-rows-5'"
          >
            <!-- Loop through generated calendar days -->
            <div
              v-for="(day, index) in calendarDays"
              :key="index"
              :class="[
                'border-b-2 md:border-b-4 border-black p-1 md:p-2 min-h-[60px] md:min-h-[120px] relative transition-colors',
                index % 7 !== 6 ? 'border-r-4' : '', // Add right borders except for last column
                day.month !== 'current'
                  ? 'bg-gray-200 dark:bg-slate-700'
                  : day.isToday
                    ? 'bg-primary z-10 shadow-[inset_0_0_0_4px_black]'
                    : 'bg-white dark:bg-slate-900 hover:bg-gray-50',
              ]"
            >
              <!-- Date Number -->
              <span
                v-if="day.isToday"
                class="font-black text-lg md:text-2xl text-black bg-white border-2 border-black rounded-full size-7 md:size-10 flex items-center justify-center shadow-neo absolute -top-2 md:-top-3 -left-2 md:-left-3"
              >
                {{ day.date }}
              </span>
              <span
                v-else
                :class="[
                  day.month !== 'current'
                    ? 'font-bold text-gray-500 text-xs md:text-base'
                    : 'font-black text-sm md:text-xl',
                  day.isSpecial ? 'text-neo-pink' : '',
                ]"
              >
                {{ day.date }}
              </span>

              <!-- Events wrapper -->
              <div
                class="flex flex-col gap-2"
                :class="{ 'mt-8': day.isToday, 'mt-2': !day.isToday }"
              >
                <div
                  v-for="(event, idx) in day.events"
                  :key="idx"
                  @click="openEventDetail(event)"
                  :class="`${event.color} border md:border-2 border-black px-1 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-bold text-black truncate shadow-sm cursor-pointer hover:opacity-80 hover:-translate-y-[1px] transition-all`"
                >
                  {{ event.title }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Right Sidebar -->
      <div class="w-full lg:w-80 flex flex-col gap-6">
        <!-- Deadlines -->
        <div
          class="bg-white dark:bg-slate-900 border-4 border-black shadow-neo rounded-xl p-6"
        >
          <h2
            class="text-2xl font-black uppercase border-b-4 border-black pb-4 mb-4 flex items-center justify-between"
          >
            Deadlines
            <span
              class="material-symbols-outlined text-neo-orange font-bold text-3xl animate-pulse"
              >warning</span
            >
          </h2>

          <div class="flex flex-col gap-4">
            <label
              v-for="task in deadlines"
              :key="task.id"
              :class="[
                'flex items-start gap-3 p-3 border-2 border-black rounded transition-all cursor-pointer group',
                task.hoverColor,
                task.done ? 'opacity-50' : '',
              ]"
            >
              <input
                v-model="task.done"
                class="mt-1 size-6 border-2 border-black rounded-sm text-black focus:ring-black focus:ring-offset-0 checked:bg-black transition-colors"
                type="checkbox"
              />
              <div>
                <p
                  :class="[
                    'font-bold text-lg leading-tight group-hover:underline transition-all',
                    task.done ? 'line-through text-gray-500' : '',
                  ]"
                >
                  {{ task.title }}
                </p>
                <p class="text-sm font-bold text-gray-500">{{ task.time }}</p>
              </div>
            </label>
          </div>

          <button
            @click="toggleView('assignments')"
            class="w-full mt-6 py-3 border-4 border-black bg-white dark:bg-slate-800 font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] transition-all cursor-pointer"
          >
            View All Tasks
          </button>
        </div>
        <!-- Mini Calendar or Stats -->
        <div
          class="bg-gradient-to-br from-orange-400 via-red-500 to-yellow-400 border-[5px] border-black rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 text-white transform hover:translate-y-[-2px] hover:translate-x-[-2px] transition-all cursor-pointer relative overflow-hidden"
        >
          <!-- Glow effect -->
          <div
            class="absolute -top-4 -right-4 w-24 h-24 bg-yellow-300 rounded-full opacity-30 blur-xl"
          ></div>
          <div
            class="absolute bottom-0 left-0 w-16 h-16 bg-orange-300 rounded-full opacity-20 blur-lg"
          ></div>

          <h3
            class="font-black uppercase text-xl mb-2 drop-shadow-[1px_1px_0px_rgba(0,0,0,0.5)]"
          >
            Study Streak
          </h3>
          <div class="flex items-center gap-4">
            <span
              class="material-symbols-outlined text-6xl font-black text-yellow-200 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)] animate-pulse"
              >local_fire_department</span
            >
            <div class="flex flex-col mt-2">
              <span
                class="text-6xl md:text-7xl font-black leading-none drop-shadow-[4px_4px_0px_rgba(0,0,0,0.3)]"
                >12</span
              >
              <span
                class="font-bold uppercase tracking-wider text-sm text-yellow-100 mt-1"
                >Days Strong</span
              >
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Render Note View conditionally -->
    <NoteView v-if="activeView === 'notes'" />

    <!-- Render Profile View conditionally -->
    <ProfileView v-if="activeView === 'profile'" @viewAchievements="toggleView('achievements')" />

    <!-- Render Achievements View conditionally -->
    <AchievementsView v-if="activeView === 'achievements'" @back="toggleView('profile')" />

    <!-- Render Assignments View conditionally -->
    <AssignmentsView v-if="activeView === 'assignments'" @navigate="toggleView" />

    <!-- Render Focus View conditionally -->
    <FocusView v-if="activeView === 'focus'" />

    <!-- Render AI Assistant View conditionally -->
    <AiAssistantView v-else-if="activeView === 'ai'" />

    <!-- Event Detail Modal (Neobrutalism) -->
    <div
      v-if="selectedEvent"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      @click.self="closeEventDetail"
    >
      <div
        class="w-full max-w-lg bg-white dark:bg-slate-900 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col"
      >
        <!-- Modal Header -->
        <div
          :class="`flex items-center justify-between border-b-4 border-black p-5 ${selectedEvent.color}`"
        >
          <h3 class="font-black uppercase text-xl text-black">
            {{ selectedEvent.title }}
          </h3>
          <button
            @click="closeEventDetail"
            class="w-8 h-8 flex items-center justify-center bg-white border-2 border-black hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <span class="material-symbols-outlined font-black text-black"
              >close</span
            >
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 flex flex-col gap-5">
          <!-- Date & Time -->
          <div class="flex items-start gap-4">
            <div
              class="w-10 h-10 flex items-center justify-center border-4 border-black bg-primary shadow-neo flex-shrink-0"
            >
              <span class="material-symbols-outlined font-black text-black"
                >schedule</span
              >
            </div>
            <div>
              <p
                class="font-black uppercase text-sm text-gray-500 dark:text-gray-400"
              >
                Date & Time
              </p>
              <p class="font-bold text-lg">{{ selectedEvent.date }}</p>
              <p class="font-bold text-gray-600 dark:text-gray-300">
                {{ selectedEvent.time }}
              </p>
            </div>
          </div>

          <!-- Location -->
          <div class="flex items-start gap-4" v-if="selectedEvent.location">
            <div
              class="w-10 h-10 flex items-center justify-center border-4 border-black bg-neo-mint shadow-neo flex-shrink-0"
            >
              <span class="material-symbols-outlined font-black text-black"
                >location_on</span
              >
            </div>
            <div>
              <p
                class="font-black uppercase text-sm text-gray-500 dark:text-gray-400"
              >
                Location
              </p>
              <p class="font-bold text-lg">{{ selectedEvent.location }}</p>
            </div>
          </div>

          <!-- Description -->
          <div class="flex items-start gap-4" v-if="selectedEvent.description">
            <div
              class="w-10 h-10 flex items-center justify-center border-4 border-black bg-neo-orange shadow-neo flex-shrink-0"
            >
              <span class="material-symbols-outlined font-black text-black"
                >description</span
              >
            </div>
            <div>
              <p
                class="font-black uppercase text-sm text-gray-500 dark:text-gray-400"
              >
                Description
              </p>
              <p class="font-bold text-base leading-relaxed">
                {{ selectedEvent.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div
          class="p-4 border-t-4 border-black bg-background-light dark:bg-slate-800 flex justify-end"
        >
          <button
            @click="closeEventDetail"
            class="px-6 py-2 border-4 border-black bg-white dark:bg-slate-700 font-bold uppercase transition-all hover:-translate-y-[2px] hover:-translate-x-[2px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Create Event Modal (Neobrutalism - Compact) -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      @click.self="closeCreateModal"
    >
      <div
        class="w-full max-w-md bg-white dark:bg-slate-900 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col max-h-[90vh] overflow-y-auto"
      >
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-4 bg-primary border-b-4 border-black">
          <h3 class="font-black uppercase text-2xl text-black tracking-tight">
            New Event
          </h3>
          <button
            @click="closeCreateModal"
            class="w-8 h-8 flex items-center justify-center bg-red-500 border-2 border-black hover:shadow-neo transition-all"
          >
            <span class="material-symbols-outlined font-black text-white text-sm">close</span>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="px-4 pb-2 mt-4 flex flex-col gap-4">
          <!-- Title -->
          <div class="flex flex-col gap-1">
            <label class="font-black uppercase text-xs text-gray-500 dark:text-gray-400">Event Title *</label>
            <input
              v-model="newEvent.title"
              type="text"
              placeholder="e.g. Crush Physics Assignment..."
              class="w-full border-2 border-black rounded py-2 px-3 font-bold text-black dark:text-white bg-white dark:bg-slate-800 focus:shadow-neo focus:outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          <!-- Category & Deadline Row -->
          <div class="flex gap-4">
            <!-- Category (Color Picker as pills) -->
            <div class="flex flex-col gap-1 flex-1">
              <label class="font-black uppercase text-xs text-gray-500 dark:text-gray-400">Category</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="color in colorOptions"
                  :key="color.value"
                  @click="newEvent.color = color.value"
                  :class="[
                    'flex items-center gap-1 px-3 py-1 border-2 text-xs font-black uppercase transition-all',
                    newEvent.color === color.value
                      ? 'border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] scale-105'
                      : 'border-gray-300 hover:border-black opacity-70 hover:opacity-100',
                  ]"
                  :style="{ backgroundColor: color.hex }"
                >
                  <span
                    v-if="newEvent.color === color.value"
                    class="material-symbols-outlined text-black"
                    style="font-size: 14px"
                  >check</span>
                  <span class="text-black">{{ color.label }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Deadline Row: Date + Time -->
          <div class="flex flex-col gap-1">
            <label class="font-black uppercase text-xs text-gray-500 dark:text-gray-400">Deadline</label>
            <div class="flex flex-col sm:flex-row gap-2">
              <input
                v-model="newEvent.date"
                type="date"
                class="flex-1 border-2 border-black rounded py-2 px-3 font-bold text-sm text-black dark:text-white bg-white dark:bg-slate-800 focus:shadow-neo focus:outline-none transition-all"
              />
              <input
                v-model="newEvent.startTime"
                type="time"
                class="w-full sm:w-24 border-2 border-black rounded py-2 px-2 font-bold text-sm text-black dark:text-white bg-white dark:bg-slate-800 focus:shadow-neo focus:outline-none transition-all"
              />
              <input
                v-model="newEvent.endTime"
                type="time"
                class="w-full sm:w-24 border-2 border-black rounded py-2 px-2 font-bold text-sm text-black dark:text-white bg-white dark:bg-slate-800 focus:shadow-neo focus:outline-none transition-all"
              />
            </div>
          </div>

          <!-- Location -->
          <div class="flex flex-col gap-1">
            <label class="font-black uppercase text-xs text-gray-500 dark:text-gray-400">Location</label>
            <input
              v-model="newEvent.location"
              type="text"
              placeholder="e.g. Room 204, Science Building"
              class="w-full border-2 border-black rounded py-2 px-3 font-bold text-sm text-black dark:text-white bg-white dark:bg-slate-800 focus:shadow-neo focus:outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          <!-- Description -->
          <div class="flex flex-col gap-1">
            <label class="font-black uppercase text-xs text-gray-500 dark:text-gray-400">Description</label>
            <textarea
              v-model="newEvent.description"
              rows="2"
              placeholder="Add event details..."
              class="w-full border-2 border-black rounded py-2 px-3 font-bold text-sm text-black dark:text-white bg-white dark:bg-slate-800 focus:shadow-neo focus:outline-none transition-all resize-none placeholder:text-gray-400"
            ></textarea>
          </div>
        </div>

        <!-- Save Button (Full Width) -->
        <div class="p-4">
          <button
            @click="createEvent"
            :disabled="!newEvent.title || !newEvent.date"
            :class="[
              'w-full py-3 border-4 border-black font-black uppercase text-lg tracking-wide transition-all flex items-center justify-center gap-2',
              newEvent.title && newEvent.date
                ? 'bg-neo-mint text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed',
            ]"
          >
            Save Event
            <span class="material-symbols-outlined font-black">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Let tailwind handle the styling */
</style>

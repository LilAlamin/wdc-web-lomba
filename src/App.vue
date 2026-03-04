<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import NoteView from "./components/NoteView.vue";

// --- View State Management ---
const activeView = ref(
  window.location.hash.includes("notes") ? "notes" : "calendar",
);

const toggleView = (view) => {
  activeView.value = view;
  window.location.hash = view === "notes" ? "notes" : "";
};

const handleHashChange = () => {
  activeView.value = window.location.hash.includes("notes")
    ? "notes"
    : "calendar";
};

onMounted(() => {
  window.addEventListener("hashchange", handleHashChange);
});

onUnmounted(() => {
  window.removeEventListener("hashchange", handleHashChange);
});

// --- Current Date Management ---
const currentMonthIndex = ref(11); // 0-11 (December)
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
    date: "2026-12-02",
    title: "CS301 Lecture",
    color: "bg-neo-pink",
    time: "10:00 AM - 11:30 AM",
    location: "Room 204, Science Building",
    description:
      "Introduction to Graph Algorithms. Please bring your textbook and complete the pre-lecture reading on BFS/DFS.",
  },
  {
    date: "2026-12-04",
    title: "Study Group",
    color: "bg-neo-mint",
    time: "3:00 PM - 5:00 PM",
    location: "Library, Study Room 3B",
    description:
      "Group study session for the upcoming CS301 final. Focus on dynamic programming and greedy algorithms.",
  },
  {
    date: "2026-12-07",
    title: "CS301 Lecture",
    color: "bg-neo-pink",
    time: "10:00 AM - 11:30 AM",
    location: "Room 204, Science Building",
    description:
      "Final review lecture. Covering all major topics from the semester.",
  },
  {
    date: "2026-12-07",
    title: "Hist Essay Due",
    color: "bg-neo-orange",
    time: "11:59 PM",
    location: "Online Submission",
    description:
      "Submit your History 202 essay on the causes and consequences of the Cold War. Minimum 2000 words.",
  },
  {
    date: "2026-12-08",
    title: "Math Lab",
    color: "bg-neo-blue",
    time: "2:00 PM - 4:00 PM",
    location: "Math Center, Room 101",
    description:
      "Hands-on practice with linear algebra problems. Bring your calculator and problem set worksheet.",
  },
  {
    date: "2026-12-09",
    title: "Design Review",
    color: "bg-white",
    time: "1:00 PM - 2:30 PM",
    location: "Design Studio, Floor 3",
    description:
      "Present your mid-semester design project. Prepare a 10-minute presentation with mockups.",
  },
  {
    date: "2026-12-15",
    title: "CS301 Final",
    color: "bg-neo-pink",
    time: "9:00 AM - 12:00 PM",
    location: "Exam Hall A",
    description:
      "Final examination covering all course material. Closed book, no electronic devices allowed.",
  },
  {
    date: "2026-12-18",
    title: "Winter Break Starts",
    color: "bg-neo-mint",
    time: "All Day",
    location: "Campus-wide",
    description:
      "The winter break officially begins. Campus facilities will operate on reduced hours.",
  },
  {
    date: "2026-12-24",
    title: "Holiday",
    color: "bg-gray-200",
    time: "All Day",
    location: "",
    description: "Christmas Eve. Campus closed.",
  },
  {
    date: "2026-12-25",
    title: "Holiday",
    color: "bg-gray-200",
    time: "All Day",
    location: "",
    description: "Christmas Day. Campus closed.",
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
  for (let i = 1; i <= daysInMonth; i++) {
    const defaultDateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
    const dayEvents = events.value.filter((e) => e.date === defaultDateStr);
    const isToday = year === 2026 && month === 11 && i === 9; // hardcoded to match the original mockup design's 'today'

    days.push({
      date: i,
      month: "current",
      isToday: isToday,
      events: dayEvents,
      isSpecial: month === 11 && (i === 24 || i === 25), // Making 24 & 25 special to match mockup
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
    title: "CS301 Final Project",
    time: "Dec 15, 11:59 PM",
    done: false,
    hoverColor: "hover:bg-primary/20",
  },
  {
    id: 2,
    title: "History 202 Essay",
    time: "Dec 7, 5:00 PM",
    done: false,
    hoverColor: "hover:bg-neo-mint/20",
  },
  {
    id: 3,
    title: "Math 415 P-Set 8",
    time: "Dec 8, 8:00 AM",
    done: false,
    hoverColor: "hover:bg-neo-blue/20",
  },
]);

// Actions
const createEventAlert = () => alert("Opening New Event Modal...");
const filterAlert = () => alert("Opening Filters...");
</script>

<template>
  <div class="relative flex h-auto min-h-screen w-full flex-col">
    <!-- TopNavBar -->
    <header
      class="flex items-center justify-between whitespace-nowrap border-b-4 border-black px-10 py-4 bg-white dark:bg-slate-900 shadow-neo mb-6 sticky top-0 z-50"
    >
      <div class="flex items-center gap-8">
        <div
          class="flex items-center gap-4 cursor-pointer"
          @click="toggleView('calendar')"
        >
          <div
            class="flex size-10 items-center justify-center bg-primary border-4 border-black rounded shadow-neo"
          >
            <span class="material-symbols-outlined font-black"
              >calendar_today</span
            >
          </div>
          <h2
            class="text-xl font-black uppercase tracking-wider border-b-2 border-black"
          >
            Buku Sakti Mahasiswa
          </h2>
        </div>
        <div class="hidden md:flex items-center gap-6">
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
            class="text-sm font-bold uppercase tracking-widest hover:bg-neo-orange hover:text-black px-3 py-1 border-2 border-transparent hover:border-black hover:shadow-neo transition-all rounded"
            href="#"
            >Assignments</a
          >
          <a
            class="text-sm font-bold uppercase tracking-widest hover:bg-neo-blue hover:text-black px-3 py-1 border-2 border-transparent hover:border-black hover:shadow-neo transition-all rounded"
            href="#"
            >Settings</a
          >
        </div>
      </div>
      <div class="flex items-center gap-6">
        <div class="relative flex items-center w-64 group">
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
        <div
          class="bg-neo-mint border-4 border-black shadow-neo aspect-square bg-cover rounded-full size-12 flex items-center justify-center cursor-pointer hover:shadow-neo-hover hover:-translate-y-1 transition-all"
        >
          <span class="material-symbols-outlined font-bold text-black"
            >person</span
          >
        </div>
      </div>
    </header>

    <!-- Render Main Calendar View conditionally -->
    <main
      v-if="activeView === 'calendar'"
      class="flex-1 flex flex-col lg:flex-row gap-8 px-10 pb-10 max-w-[1600px] mx-auto w-full"
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
              class="size-12 rounded-full border-4 border-black bg-neo-blue shadow-neo hover:shadow-neo-hover hover:translate-y-1 hover:translate-x-1 flex items-center justify-center transition-all"
            >
              <span class="material-symbols-outlined font-black text-black"
                >arrow_back</span
              >
            </button>
            <h1 class="text-5xl font-black uppercase tracking-tighter">
              {{ currentMonthName }} {{ currentYear }}
            </h1>
            <button
              @click="nextMonth"
              class="size-12 rounded-full border-4 border-black bg-neo-pink shadow-neo hover:shadow-neo-hover hover:translate-y-1 hover:translate-x-1 flex items-center justify-center transition-all"
            >
              <span class="material-symbols-outlined font-black text-black"
                >arrow_forward</span
              >
            </button>
          </div>
          <div class="flex gap-4">
            <button
              @click="filterAlert"
              class="flex items-center justify-center gap-2 border-4 border-black rounded bg-white dark:bg-slate-800 px-6 py-3 font-bold uppercase shadow-neo hover:shadow-neo-hover hover:translate-y-1 hover:translate-x-1 transition-all"
            >
              <span class="material-symbols-outlined font-bold"
                >filter_list</span
              >
              Filter
            </button>
            <button
              @click="createEventAlert"
              class="flex items-center justify-center gap-2 border-4 border-black rounded bg-primary text-black px-6 py-3 font-bold uppercase shadow-neo hover:shadow-neo-hover hover:translate-y-1 hover:translate-x-1 transition-all"
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
            <div
              class="py-4 text-center font-black uppercase border-r-4 border-black"
            >
              Sun
            </div>
            <div
              class="py-4 text-center font-black uppercase border-r-4 border-black"
            >
              Mon
            </div>
            <div
              class="py-4 text-center font-black uppercase border-r-4 border-black"
            >
              Tue
            </div>
            <div
              class="py-4 text-center font-black uppercase border-r-4 border-black"
            >
              Wed
            </div>
            <div
              class="py-4 text-center font-black uppercase border-r-4 border-black"
            >
              Thu
            </div>
            <div
              class="py-4 text-center font-black uppercase border-r-4 border-black"
            >
              Fri
            </div>
            <div class="py-4 text-center font-black uppercase">Sat</div>
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
                'border-b-4 border-black p-2 min-h-[120px] relative transition-colors',
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
                class="font-black text-2xl text-black bg-white border-2 border-black rounded-full size-10 flex items-center justify-center shadow-neo absolute -top-3 -left-3"
              >
                {{ day.date }}
              </span>
              <span
                v-else
                :class="[
                  day.month !== 'current'
                    ? 'font-bold text-gray-500'
                    : 'font-black text-xl',
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
                  :class="`${event.color} border-2 border-black px-2 py-1 text-xs font-bold text-black truncate shadow-sm cursor-pointer hover:opacity-80 hover:-translate-y-[1px] transition-all`"
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
            class="w-full mt-6 py-3 border-4 border-black bg-white dark:bg-slate-800 font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] transition-all cursor-pointer"
          >
            View All Tasks
          </button>
        </div>
        <!-- Mini Calendar or Stats -->
        <div
          class="bg-gradient-to-br from-orange-400 via-red-500 to-yellow-400 border-4 border-black shadow-neo rounded-xl p-6 text-white transform hover:scale-[1.02] hover:rotate-1 transition-all cursor-pointer relative overflow-hidden"
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
              class="material-symbols-outlined text-5xl font-black text-yellow-200 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)] animate-pulse"
              >local_fire_department</span
            >
            <div class="flex flex-col">
              <span
                class="text-4xl font-black drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)]"
                >12</span
              >
              <span
                class="font-bold uppercase tracking-wider text-sm text-yellow-100"
                >Days Strong</span
              >
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Render Note View conditionally -->
    <NoteView v-else-if="activeView === 'notes'" />

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
  </div>
</template>

<style>
/* Let tailwind handle the styling */
</style>

<script setup>
import { ref, computed, onUnmounted, watch } from "vue";

// --- Settings ---
const showSettings = ref(false);
const settings = ref({
  focusDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  sessionsBeforeLong: 4,
  autoStartBreak: true,
  autoStartFocus: false,
  soundEnabled: true,
});
const tempSettings = ref({ ...settings.value });

const openSettings = () => {
  tempSettings.value = { ...settings.value };
  showSettings.value = true;
};
const saveSettings = () => {
  settings.value = { ...tempSettings.value };
  showSettings.value = false;
  if (!timerRunning.value) {
    if (timerMode.value === "focus") {
      timerSeconds.value = settings.value.focusDuration * 60;
    } else if (timerMode.value === "shortBreak") {
      timerSeconds.value = settings.value.shortBreak * 60;
    } else {
      timerSeconds.value = settings.value.longBreak * 60;
    }
  }
};

// --- Timer State ---
const timerSeconds = ref(25 * 60);
const timerRunning = ref(false);
const timerInterval = ref(null);
const currentSession = ref(1);
const timerMode = ref("focus"); // 'focus', 'shortBreak', 'longBreak'

const focusDurationSec = computed(() => settings.value.focusDuration * 60);
const shortBreakSec = computed(() => settings.value.shortBreak * 60);
const longBreakSec = computed(() => settings.value.longBreak * 60);

const currentDurationSec = computed(() => {
  if (timerMode.value === "focus") return focusDurationSec.value;
  if (timerMode.value === "shortBreak") return shortBreakSec.value;
  return longBreakSec.value;
});

const timerProgress = computed(() => {
  const total = currentDurationSec.value;
  if (total === 0) return 0;
  return ((total - timerSeconds.value) / total) * 100;
});

const displayTime = computed(() => {
  const mins = Math.floor(timerSeconds.value / 60);
  const secs = timerSeconds.value % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
});

const modeLabel = computed(() => {
  if (timerMode.value === "focus") return "FOCUS MODE";
  if (timerMode.value === "shortBreak") return "SHORT BREAK";
  return "LONG BREAK";
});

const modeBgClass = computed(() => {
  if (timerMode.value === "focus") return "";
  if (timerMode.value === "shortBreak") return "timer-break-short";
  return "timer-break-long";
});

const playSound = () => {
  if (!settings.value.soundEnabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const playBeep = (freq, startTime, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };
    playBeep(880, ctx.currentTime, 0.15);
    playBeep(880, ctx.currentTime + 0.2, 0.15);
    playBeep(1100, ctx.currentTime + 0.4, 0.3);
  } catch (e) { /* silent fallback */ }
};

const completeSession = () => {
  clearInterval(timerInterval.value);
  timerRunning.value = false;
  playSound();

  if (timerMode.value === "focus") {
    // Record in history
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    focusHistory.value.unshift({
      id: Date.now(),
      title: currentTask.value ? currentTask.value.title : "Focus Session",
      duration: `${settings.value.focusDuration} min`,
      time: timeStr,
      type: "focus",
    });
    totalFocusMinutes.value += settings.value.focusDuration;
    completedSessions.value++;

    // Determine break type
    if (currentSession.value >= settings.value.sessionsBeforeLong) {
      timerMode.value = "longBreak";
      timerSeconds.value = longBreakSec.value;
      currentSession.value = 1;
    } else {
      timerMode.value = "shortBreak";
      timerSeconds.value = shortBreakSec.value;
      currentSession.value++;
    }
    if (settings.value.autoStartBreak) {
      setTimeout(startTimer, 500);
    }
  } else {
    // Break completed → record
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const breakLabel = timerMode.value === "shortBreak" ? "Short Break" : "Long Break";
    focusHistory.value.unshift({
      id: Date.now(),
      title: currentTask.value ? currentTask.value.title : breakLabel,
      duration: breakLabel,
      time: timeStr,
      type: "break",
    });
    timerMode.value = "focus";
    timerSeconds.value = focusDurationSec.value;
    if (settings.value.autoStartFocus) {
      setTimeout(startTimer, 500);
    }
  }
};

const startTimer = () => {
  if (timerRunning.value) return;
  timerRunning.value = true;
  timerInterval.value = setInterval(() => {
    if (timerSeconds.value > 0) {
      timerSeconds.value--;
    } else {
      completeSession();
    }
  }, 1000);
};

const pauseTimer = () => {
  clearInterval(timerInterval.value);
  timerRunning.value = false;
};

const resetTimer = () => {
  clearInterval(timerInterval.value);
  timerRunning.value = false;
  timerMode.value = "focus";
  timerSeconds.value = focusDurationSec.value;
};

const skipToNext = () => {
  clearInterval(timerInterval.value);
  timerRunning.value = false;
  if (timerMode.value === "focus") {
    if (currentSession.value >= settings.value.sessionsBeforeLong) {
      timerMode.value = "longBreak";
      timerSeconds.value = longBreakSec.value;
      currentSession.value = 1;
    } else {
      timerMode.value = "shortBreak";
      timerSeconds.value = shortBreakSec.value;
      currentSession.value++;
    }
  } else {
    timerMode.value = "focus";
    timerSeconds.value = focusDurationSec.value;
  }
};

onUnmounted(() => {
  clearInterval(timerInterval.value);
});

// --- Task Management ---
const tasks = ref([
  {
    id: 1,
    subject: "PHYSICS 101",
    subjectColor: "bg-neo-blue",
    title: "Kinematics P-Set 4",
    description: "Complete problems 1 through 15. Focus on projectile motion equations.",
    subtasks: [
      { id: 1, text: "Review notes", done: true },
      { id: 2, text: "Solve problems 1-8", done: false },
      { id: 3, text: "Solve problems 9-15", done: false },
    ],
  },
  {
    id: 2,
    subject: "CS301",
    subjectColor: "bg-neo-pink",
    title: "Graph Algorithms Lab",
    description: "Implement BFS and DFS traversal. Test with sample datasets.",
    subtasks: [
      { id: 1, text: "Write BFS code", done: false },
      { id: 2, text: "Write DFS code", done: false },
      { id: 3, text: "Run test cases", done: false },
    ],
  },
  {
    id: 3,
    subject: "HISTORY 202",
    subjectColor: "bg-neo-orange",
    title: "Cold War Essay Draft",
    description: "Write the first draft of the essay on Cold War causes.",
    subtasks: [
      { id: 1, text: "Outline structure", done: true },
      { id: 2, text: "Write introduction", done: false },
      { id: 3, text: "Add citations", done: false },
    ],
  },
]);

const activeTaskId = ref(1);
const currentTask = computed(() => tasks.value.find((t) => t.id === activeTaskId.value) || null);
const showTaskMenu = ref(false);
const showTaskSelector = ref(false);

const selectTask = (id) => {
  activeTaskId.value = id;
  showTaskSelector.value = false;
};

const taskProgress = computed(() => {
  if (!currentTask.value || !currentTask.value.subtasks.length) return 0;
  const done = currentTask.value.subtasks.filter((s) => s.done).length;
  return Math.round((done / currentTask.value.subtasks.length) * 100);
});

// --- Add subtask ---
const newSubtaskText = ref("");
const addSubtask = () => {
  if (!newSubtaskText.value.trim() || !currentTask.value) return;
  currentTask.value.subtasks.push({
    id: Date.now(),
    text: newSubtaskText.value.trim(),
    done: false,
  });
  newSubtaskText.value = "";
};

const removeSubtask = (subtaskId) => {
  if (!currentTask.value) return;
  currentTask.value.subtasks = currentTask.value.subtasks.filter((s) => s.id !== subtaskId);
};

// --- Stats ---
const totalFocusMinutes = ref(75); // dummy starting data
const completedSessions = ref(3);
const currentStreak = ref(3);

const totalFocusDisplay = computed(() => {
  const h = Math.floor(totalFocusMinutes.value / 60);
  const m = totalFocusMinutes.value % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
});

// --- Focus History ---
const focusHistory = ref([
  { id: 1, title: "History 202 Essay", duration: "25 min", time: "09:00 AM", type: "focus" },
  { id: 2, title: "History 202 Essay", duration: "25 min", time: "09:30 AM", type: "focus" },
  { id: 3, title: "CS301 Project", duration: "Short Break", time: "10:00 AM", type: "break" },
]);

const showAllHistory = ref(false);
const displayedHistory = computed(() => {
  if (showAllHistory.value) return focusHistory.value;
  return focusHistory.value.slice(0, 5);
});

const clearHistory = () => {
  focusHistory.value = [];
};
</script>

<template>
  <main
    class="flex-1 flex flex-col items-center gap-6 md:gap-10 px-4 md:px-10 pb-6 md:pb-10 max-w-[1600px] mx-auto w-full"
  >
    <!-- Stats Bar -->
    <div class="w-full flex flex-wrap items-center justify-center gap-4">
      <div class="flex items-center gap-3 px-5 py-3 border-4 border-black bg-white dark:bg-slate-900 shadow-neo">
        <span class="material-symbols-outlined text-neo-pink font-bold text-2xl">local_fire_department</span>
        <div class="flex flex-col">
          <span class="font-black text-lg leading-none">{{ currentStreak }}</span>
          <span class="text-xs font-bold text-gray-500 uppercase">Day Streak</span>
        </div>
      </div>
      <div class="flex items-center gap-3 px-5 py-3 border-4 border-black bg-white dark:bg-slate-900 shadow-neo">
        <span class="material-symbols-outlined text-neo-mint font-bold text-2xl">timer</span>
        <div class="flex flex-col">
          <span class="font-black text-lg leading-none">{{ totalFocusDisplay }}</span>
          <span class="text-xs font-bold text-gray-500 uppercase">Total Focus</span>
        </div>
      </div>
      <div class="flex items-center gap-3 px-5 py-3 border-4 border-black bg-white dark:bg-slate-900 shadow-neo">
        <span class="material-symbols-outlined text-neo-blue font-bold text-2xl">check_circle</span>
        <div class="flex flex-col">
          <span class="font-black text-lg leading-none">{{ completedSessions }}</span>
          <span class="text-xs font-bold text-gray-500 uppercase">Sessions</span>
        </div>
      </div>
      <!-- Settings Button -->
      <button
        @click="openSettings"
        class="flex items-center gap-2 px-5 py-3 border-4 border-black bg-primary text-black font-black uppercase text-sm shadow-neo hover:shadow-neo-hover hover:translate-y-[2px] hover:translate-x-[2px] transition-all cursor-pointer"
      >
        <span class="material-symbols-outlined font-bold">settings</span>
        Settings
      </button>
    </div>

    <!-- Layout: 3-column -->
    <div class="flex flex-col lg:flex-row gap-6 md:gap-8 w-full items-start justify-center">
      <!-- LEFT: Current Task Panel -->
      <div class="w-full lg:w-[320px] flex-shrink-0 order-2 lg:order-1 flex flex-col gap-4">
        <div class="bg-white dark:bg-slate-900 border-4 border-black shadow-neo overflow-hidden">
          <!-- Header -->
          <div class="bg-gray-100 dark:bg-slate-800 border-b-4 border-black px-5 py-3 flex items-center justify-between">
            <h3 class="font-black uppercase text-sm tracking-widest">Current Task</h3>
            <button
              @click="showTaskSelector = !showTaskSelector"
              class="flex items-center gap-1 px-3 py-1 border-2 border-black bg-white text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] transition-all cursor-pointer"
            >
              <span class="material-symbols-outlined text-sm">swap_horiz</span>
              Switch
            </button>
          </div>

          <!-- Task Selector Dropdown -->
          <div v-if="showTaskSelector" class="border-b-4 border-black bg-gray-50 dark:bg-slate-800 p-3 flex flex-col gap-2">
            <div
              v-for="task in tasks"
              :key="task.id"
              @click="selectTask(task.id)"
              :class="[
                'flex items-center gap-3 p-3 border-2 rounded cursor-pointer transition-all',
                task.id === activeTaskId
                  ? 'border-black bg-primary/20 shadow-neo'
                  : 'border-gray-300 hover:border-black hover:bg-white dark:hover:bg-slate-700',
              ]"
            >
              <span :class="[task.subjectColor, 'px-2 py-0.5 text-[10px] font-black uppercase border-2 border-black text-black']">
                {{ task.subject }}
              </span>
              <span class="font-bold text-sm truncate">{{ task.title }}</span>
            </div>
          </div>

          <!-- Body -->
          <div v-if="currentTask" class="p-5 flex flex-col gap-4">
            <!-- Subject + Menu -->
            <div class="flex items-center justify-between">
              <span :class="[currentTask.subjectColor, 'px-3 py-1 text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black']">
                {{ currentTask.subject }}
              </span>
              <div class="relative">
                <button
                  @click="showTaskMenu = !showTaskMenu"
                  class="w-8 h-8 flex items-center justify-center border-2 border-black bg-white hover:shadow-neo transition-all cursor-pointer"
                >
                  <span class="material-symbols-outlined font-bold text-black text-sm">more_horiz</span>
                </button>
                <!-- Task Menu Dropdown -->
                <div v-if="showTaskMenu" class="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-slate-800 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-20 flex flex-col">
                  <button @click="showTaskMenu = false" class="px-4 py-2 text-left text-sm font-bold hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 cursor-pointer">
                    <span class="material-symbols-outlined text-sm">edit</span> Edit Task
                  </button>
                  <button @click="showTaskMenu = false" class="px-4 py-2 text-left text-sm font-bold hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 cursor-pointer">
                    <span class="material-symbols-outlined text-sm">check_circle</span> Mark Done
                  </button>
                  <button @click="showTaskMenu = false" class="px-4 py-2 text-left text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 cursor-pointer">
                    <span class="material-symbols-outlined text-sm">delete</span> Remove
                  </button>
                </div>
              </div>
            </div>

            <!-- Task Title -->
            <h4 class="font-black text-xl leading-tight">{{ currentTask.title }}</h4>

            <!-- Description -->
            <p class="text-sm font-bold text-gray-600 dark:text-gray-400 leading-relaxed">
              {{ currentTask.description }}
            </p>

            <!-- Progress Bar -->
            <div class="flex flex-col gap-1">
              <div class="flex items-center justify-between">
                <span class="text-xs font-black uppercase text-gray-500">Progress</span>
                <span class="text-xs font-black">{{ taskProgress }}%</span>
              </div>
              <div class="w-full h-3 bg-gray-200 dark:bg-slate-700 border-2 border-black rounded-full overflow-hidden">
                <div
                  class="h-full bg-neo-mint transition-all duration-500 ease-out"
                  :style="{ width: taskProgress + '%' }"
                ></div>
              </div>
            </div>

            <!-- Subtasks -->
            <div class="flex flex-col gap-2 mt-1">
              <label
                v-for="sub in currentTask.subtasks"
                :key="sub.id"
                class="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  v-model="sub.done"
                  type="checkbox"
                  class="size-5 border-2 border-black rounded-sm text-black focus:ring-black focus:ring-offset-0 checked:bg-neo-mint transition-colors flex-shrink-0"
                />
                <span
                  :class="[
                    'font-bold text-sm group-hover:underline transition-all flex-1',
                    sub.done ? 'line-through text-gray-400' : 'text-black dark:text-white',
                  ]"
                >
                  {{ sub.text }}
                </span>
                <button
                  @click.prevent="removeSubtask(sub.id)"
                  class="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center text-red-400 hover:text-red-600 transition-all cursor-pointer"
                >
                  <span class="material-symbols-outlined" style="font-size: 14px">close</span>
                </button>
              </label>

              <!-- Add Subtask -->
              <div class="flex items-center gap-2 mt-2">
                <input
                  v-model="newSubtaskText"
                  @keyup.enter="addSubtask"
                  type="text"
                  placeholder="Add subtask..."
                  class="flex-1 border-2 border-dashed border-gray-400 rounded py-1.5 px-3 text-sm font-bold bg-transparent focus:border-black focus:outline-none transition-all placeholder:text-gray-400"
                />
                <button
                  @click="addSubtask"
                  class="w-8 h-8 flex items-center justify-center border-2 border-black bg-neo-mint text-black hover:shadow-neo transition-all cursor-pointer flex-shrink-0"
                >
                  <span class="material-symbols-outlined font-bold" style="font-size: 16px">add</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CENTER: Timer Panel -->
      <div class="w-full lg:flex-1 flex flex-col items-center gap-6 order-1 lg:order-2">
        <!-- Mode Tabs -->
        <div class="flex items-center gap-0 border-4 border-black bg-white dark:bg-slate-900 shadow-neo overflow-hidden">
          <button
            @click="if (!timerRunning) { timerMode = 'focus'; timerSeconds = focusDurationSec; }"
            :class="[
              'px-5 py-2 font-black uppercase text-sm tracking-wider transition-all cursor-pointer border-r-4 border-black',
              timerMode === 'focus' ? 'bg-neo-pink text-black' : 'bg-white dark:bg-slate-900 hover:bg-gray-100',
            ]"
          >
            Focus
          </button>
          <button
            @click="if (!timerRunning) { timerMode = 'shortBreak'; timerSeconds = shortBreakSec; }"
            :class="[
              'px-5 py-2 font-black uppercase text-sm tracking-wider transition-all cursor-pointer border-r-4 border-black',
              timerMode === 'shortBreak' ? 'bg-neo-mint text-black' : 'bg-white dark:bg-slate-900 hover:bg-gray-100',
            ]"
          >
            Short Break
          </button>
          <button
            @click="if (!timerRunning) { timerMode = 'longBreak'; timerSeconds = longBreakSec; }"
            :class="[
              'px-5 py-2 font-black uppercase text-sm tracking-wider transition-all cursor-pointer',
              timerMode === 'longBreak' ? 'bg-neo-blue text-black' : 'bg-white dark:bg-slate-900 hover:bg-gray-100',
            ]"
          >
            Long Break
          </button>
        </div>

        <!-- Timer Box -->
        <div
          class="relative bg-white dark:bg-slate-900 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-[480px] overflow-hidden"
        >
          <!-- Window bar -->
          <div class="flex items-center justify-between px-4 py-2 border-b-4 border-black bg-gray-100 dark:bg-slate-800">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-neo-orange border border-black"></span>
              <span class="w-3 h-3 rounded-full bg-primary border border-black"></span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-neo-mint border border-black"></span>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="w-full h-2 bg-gray-200 dark:bg-slate-700">
            <div
              :class="[
                'h-full transition-all duration-1000 ease-linear',
                timerMode === 'focus' ? 'bg-neo-pink' : timerMode === 'shortBreak' ? 'bg-neo-mint' : 'bg-neo-blue',
              ]"
              :style="{ width: timerProgress + '%' }"
            ></div>
          </div>

          <!-- Decorative border glow -->
          <div
            class="absolute inset-0 pointer-events-none"
            :style="{
              boxShadow: timerMode === 'focus'
                ? 'inset 0 0 0 6px #ff6bdf40'
                : timerMode === 'shortBreak'
                  ? 'inset 0 0 0 6px #00ff9d40'
                  : 'inset 0 0 0 6px #00d0ff40',
            }"
          ></div>

          <!-- Timer Display -->
          <div class="flex flex-col items-center justify-center py-10 md:py-14 px-6 relative">
            <span class="absolute top-6 left-1/2 -translate-x-12 w-2 h-2 rounded-full bg-neo-blue"></span>
            <span class="absolute bottom-8 right-10 w-2 h-2 rounded-full bg-neo-pink"></span>

            <h1
              :class="[
                'text-[80px] md:text-[120px] font-black leading-none tracking-tighter select-none transition-colors',
                timerRunning ? 'text-black dark:text-white' : 'text-black dark:text-white',
              ]"
            >
              {{ displayTime }}
            </h1>
            <div
              :class="[
                'mt-3 px-6 py-1 border-4 border-black font-black uppercase text-sm tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]',
                timerMode === 'focus' ? 'bg-white dark:bg-slate-800' : timerMode === 'shortBreak' ? 'bg-neo-mint/20' : 'bg-neo-blue/20',
              ]"
            >
              {{ modeLabel }}
            </div>
          </div>
        </div>

        <!-- Control Buttons -->
        <div class="flex items-center gap-4 md:gap-6">
          <button
            @click="startTimer"
            :disabled="timerRunning"
            :class="[
              'px-8 md:px-10 py-3 border-4 border-black font-black uppercase text-lg tracking-wide transition-all',
              timerRunning
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                : 'bg-neo-mint text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] cursor-pointer',
            ]"
          >
            Start
          </button>
          <button
            @click="pauseTimer"
            :disabled="!timerRunning"
            :class="[
              'px-8 md:px-10 py-3 border-4 border-black font-black uppercase text-lg tracking-wide transition-all',
              !timerRunning
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                : 'bg-primary text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] cursor-pointer',
            ]"
          >
            Pause
          </button>
          <button
            @click="resetTimer"
            class="px-8 md:px-10 py-3 border-4 border-black bg-neo-orange text-black font-black uppercase text-lg tracking-wide shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all cursor-pointer"
          >
            Reset
          </button>
          <button
            @click="skipToNext"
            class="px-4 py-3 border-4 border-black bg-white dark:bg-slate-800 text-black dark:text-white font-black uppercase text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all cursor-pointer"
            title="Skip to next"
          >
            <span class="material-symbols-outlined font-bold">skip_next</span>
          </button>
        </div>

        <!-- Session Indicator -->
        <div class="flex items-center gap-4 px-6 py-3 border-4 border-black bg-white dark:bg-slate-900 shadow-neo">
          <span class="font-black uppercase text-sm tracking-widest">Session</span>
          <div class="flex items-center gap-2">
            <span
              v-for="s in settings.sessionsBeforeLong"
              :key="s"
              :class="[
                'w-5 h-5 rounded-full border-2 border-black transition-all',
                s <= currentSession
                  ? 'bg-neo-pink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-gray-200 dark:bg-slate-700',
              ]"
            ></span>
          </div>
          <span class="text-xs font-bold text-gray-500">{{ currentSession }} / {{ settings.sessionsBeforeLong }}</span>
        </div>
      </div>

      <!-- RIGHT: History Panel -->
      <div class="w-full lg:w-[320px] flex-shrink-0 order-3">
        <div class="bg-white dark:bg-slate-900 border-4 border-black shadow-neo overflow-hidden">
          <!-- Header -->
          <div class="bg-gray-100 dark:bg-slate-800 border-b-4 border-black px-5 py-3 flex items-center justify-between">
            <h3 class="font-black uppercase text-sm tracking-widest">History</h3>
            <button
              v-if="focusHistory.length > 0"
              @click="clearHistory"
              class="text-xs font-bold text-red-500 hover:underline cursor-pointer"
            >
              Clear
            </button>
          </div>

          <!-- History Items -->
          <div class="p-4 flex flex-col gap-3 max-h-[420px] overflow-y-auto">
            <div
              v-for="item in displayedHistory"
              :key="item.id"
              class="flex items-start gap-3 p-3 border-2 border-black rounded bg-white dark:bg-slate-800 hover:shadow-neo transition-all"
            >
              <!-- Icon -->
              <div
                :class="[
                  'w-8 h-8 flex items-center justify-center border-2 border-black rounded flex-shrink-0',
                  item.type === 'focus' ? 'bg-neo-mint' : 'bg-neo-blue',
                ]"
              >
                <span class="material-symbols-outlined font-black text-black text-sm">
                  {{ item.type === 'focus' ? 'check' : 'coffee' }}
                </span>
              </div>
              <!-- Info -->
              <div class="flex flex-col min-w-0">
                <span class="font-black text-sm leading-tight truncate">{{ item.title }}</span>
                <span class="text-xs font-bold text-gray-500">{{ item.duration }} • {{ item.time }}</span>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="focusHistory.length === 0" class="text-center py-8 text-gray-400">
              <span class="material-symbols-outlined text-4xl mb-2 block">history</span>
              <p class="font-bold text-sm">No focus sessions yet</p>
              <p class="text-xs mt-1">Start a focus session to see your history</p>
            </div>
          </div>

          <!-- View All Button -->
          <div class="px-4 pb-4" v-if="focusHistory.length > 5">
            <button
              @click="showAllHistory = !showAllHistory"
              class="w-full py-3 border-4 border-black bg-white dark:bg-slate-800 font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] transition-all cursor-pointer text-sm tracking-widest"
            >
              {{ showAllHistory ? 'Show Less' : 'View All' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Modal -->
    <div
      v-if="showSettings"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      @click.self="showSettings = false"
    >
      <div class="w-full max-w-md bg-white dark:bg-slate-900 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-4 bg-primary border-b-4 border-black">
          <h3 class="font-black uppercase text-xl text-black tracking-tight flex items-center gap-2">
            <span class="material-symbols-outlined font-bold">settings</span>
            Timer Settings
          </h3>
          <button
            @click="showSettings = false"
            class="w-8 h-8 flex items-center justify-center bg-red-500 border-2 border-black hover:shadow-neo transition-all cursor-pointer"
          >
            <span class="material-symbols-outlined font-black text-white text-sm">close</span>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-5 flex flex-col gap-5">
          <!-- Duration Settings -->
          <div class="flex flex-col gap-1">
            <label class="font-black uppercase text-xs text-gray-500">Focus Duration (minutes)</label>
            <div class="flex items-center gap-3">
              <input
                v-model.number="tempSettings.focusDuration"
                type="range"
                min="1"
                max="120"
                class="flex-1 accent-neo-pink"
              />
              <div class="w-16 border-2 border-black rounded py-1 text-center font-black text-lg bg-white dark:bg-slate-800">
                {{ tempSettings.focusDuration }}
              </div>
            </div>
            <div class="flex gap-2 mt-1">
              <button v-for="preset in [15, 25, 30, 45, 60]" :key="preset" @click="tempSettings.focusDuration = preset"
                :class="['px-3 py-1 border-2 text-xs font-black cursor-pointer transition-all', tempSettings.focusDuration === preset ? 'border-black bg-neo-pink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'border-gray-300 hover:border-black']"
              >
                {{ preset }}m
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label class="font-black uppercase text-xs text-gray-500">Short Break (minutes)</label>
            <div class="flex items-center gap-3">
              <input
                v-model.number="tempSettings.shortBreak"
                type="range"
                min="1"
                max="30"
                class="flex-1 accent-neo-mint"
              />
              <div class="w-16 border-2 border-black rounded py-1 text-center font-black text-lg bg-white dark:bg-slate-800">
                {{ tempSettings.shortBreak }}
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label class="font-black uppercase text-xs text-gray-500">Long Break (minutes)</label>
            <div class="flex items-center gap-3">
              <input
                v-model.number="tempSettings.longBreak"
                type="range"
                min="5"
                max="60"
                class="flex-1 accent-neo-blue"
              />
              <div class="w-16 border-2 border-black rounded py-1 text-center font-black text-lg bg-white dark:bg-slate-800">
                {{ tempSettings.longBreak }}
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label class="font-black uppercase text-xs text-gray-500">Sessions Before Long Break</label>
            <div class="flex items-center gap-3">
              <input
                v-model.number="tempSettings.sessionsBeforeLong"
                type="range"
                min="2"
                max="8"
                class="flex-1 accent-primary"
              />
              <div class="w-16 border-2 border-black rounded py-1 text-center font-black text-lg bg-white dark:bg-slate-800">
                {{ tempSettings.sessionsBeforeLong }}
              </div>
            </div>
          </div>

          <!-- Toggle Switches -->
          <div class="border-t-4 border-black pt-4 flex flex-col gap-3">
            <label class="flex items-center justify-between cursor-pointer group">
              <span class="font-bold text-sm">Auto-start Break</span>
              <div class="relative">
                <input type="checkbox" v-model="tempSettings.autoStartBreak" class="sr-only peer" />
                <div class="w-12 h-7 bg-gray-300 border-2 border-black rounded-full peer-checked:bg-neo-mint transition-colors"></div>
                <div class="absolute top-0.5 left-0.5 w-6 h-6 bg-white border-2 border-black rounded-full transition-transform peer-checked:translate-x-5"></div>
              </div>
            </label>
            <label class="flex items-center justify-between cursor-pointer group">
              <span class="font-bold text-sm">Auto-start Focus after Break</span>
              <div class="relative">
                <input type="checkbox" v-model="tempSettings.autoStartFocus" class="sr-only peer" />
                <div class="w-12 h-7 bg-gray-300 border-2 border-black rounded-full peer-checked:bg-neo-mint transition-colors"></div>
                <div class="absolute top-0.5 left-0.5 w-6 h-6 bg-white border-2 border-black rounded-full transition-transform peer-checked:translate-x-5"></div>
              </div>
            </label>
            <label class="flex items-center justify-between cursor-pointer group">
              <span class="font-bold text-sm">Sound Notification</span>
              <div class="relative">
                <input type="checkbox" v-model="tempSettings.soundEnabled" class="sr-only peer" />
                <div class="w-12 h-7 bg-gray-300 border-2 border-black rounded-full peer-checked:bg-neo-mint transition-colors"></div>
                <div class="absolute top-0.5 left-0.5 w-6 h-6 bg-white border-2 border-black rounded-full transition-transform peer-checked:translate-x-5"></div>
              </div>
            </label>
          </div>
        </div>

        <!-- Save Button -->
        <div class="p-4 border-t-4 border-black">
          <button
            @click="saveSettings"
            class="w-full py-3 border-4 border-black bg-neo-mint text-black font-black uppercase text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            Save Settings
            <span class="material-symbols-outlined font-black">check</span>
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

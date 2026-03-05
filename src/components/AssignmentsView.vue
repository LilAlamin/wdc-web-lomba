<script setup>
import { ref, computed } from "vue";

defineEmits(["navigate"]);

// Dummy Data
const tasks = ref([
  {
    id: 1,
    title: "CS301 Final Project",
    time: "Dec 15, 11:59 PM",
    status: "pending",
    priority: "HIGH PRIORITY",
    priorityColor: "bg-neo-pink",
  },
  {
    id: 2,
    title: "History 202 Essay",
    time: "Dec 7, 5:00 PM",
    status: "completed",
    priority: "MEDIUM",
    priorityColor: "bg-neo-orange",
  },
  {
    id: 3,
    title: "Math 415 P-Set 8",
    time: "Dec 8, 8:00 AM - OVERDUE",
    status: "overdue",
    priority: "LATE",
    priorityColor: "bg-white",
  },
  {
    id: 4,
    title: "Design Review Prep",
    time: "Dec 9, 2:00 PM",
    status: "pending",
    priority: "LOW",
    priorityColor: "bg-neo-blue",
  },
]);

const showTaskModal = ref(false);
const newTask = ref({
  title: "",
  date: "",
  time: "",
  priority: "MEDIUM",
  priorityColor: "bg-neo-orange",
});

const priorityOptions = [
  { label: "HIGH PRIORITY", value: "HIGH PRIORITY", color: "bg-neo-pink" },
  { label: "MEDIUM", value: "MEDIUM", color: "bg-neo-orange" },
  { label: "LOW", value: "LOW", color: "bg-neo-blue" },
];

const openTaskModal = () => {
  newTask.value = {
    title: "",
    date: "",
    time: "",
    priority: "MEDIUM",
    priorityColor: "bg-neo-orange",
  };
  showTaskModal.value = true;
};

const closeTaskModal = () => {
  showTaskModal.value = false;
};

const createTask = () => {
  if (!newTask.value.title) return;
  
  let timeStr = "";
  if (newTask.value.date) {
    timeStr = newTask.value.date + (newTask.value.time ? ` ${newTask.value.time}` : "");
  }

  tasks.value.push({
    id: tasks.value.length + 1,
    title: newTask.value.title,
    time: timeStr || "No deadline",
    status: "pending",
    priority: newTask.value.priority,
    priorityColor: newTask.value.priorityColor,
  });
  closeTaskModal();
};

const activeFilter = ref("all"); // 'all', 'HIGH PRIORITY', 'MEDIUM', 'LOW'

const filteredTasks = computed(() => {
  let filtered = tasks.value;
  if (activeFilter.value !== "all") {
    filtered = tasks.value.filter((t) => t.priority === activeFilter.value);
  }
  
  const priorityWeight = {
    "LATE": 5, // Overdue tasks at the very top
    "HIGH PRIORITY": 4,
    "MEDIUM": 3,
    "LOW": 2
  };
  
  return [...filtered].sort((a, b) => {
    const weightA = priorityWeight[a.priority] || 0;
    const weightB = priorityWeight[b.priority] || 0;
    return weightB - weightA;
  });
});

const progress = computed(() => {
  const total = tasks.value.length;
  if (total === 0) return { completed: 0, pending: 0, overdue: 0 };
  return {
    completed: Math.round((tasks.value.filter((t) => t.status === "completed").length / total) * 100),
    pending: Math.round((tasks.value.filter((t) => t.status === "pending").length / total) * 100),
    overdue: Math.round((tasks.value.filter((t) => t.status === "overdue").length / total) * 100),
  };
});

const stats = computed(() => {
  const total = 20; // Example total max tasks for progress bars
  const completed = 15;
  const pending = 4;
  const overdue = 1;

  return {
    total,
    completed,
    pending,
    overdue,
    completedPct: (completed / total) * 100,
    pendingPct: (pending / total) * 100,
    overduePct: (overdue / total) * 100,
  };
});
</script>

<template>
  <main class="flex-1 flex flex-col lg:flex-row gap-8 px-10 pb-10 w-full max-w-[1600px] mx-auto">
    <!-- Main Task Area -->
    <div class="flex-1 flex flex-col gap-6">
      
      <!-- Header Area -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-slate-900 px-6 py-5 border-[5px] border-black shadow-neo rounded-full">
        <div class="flex items-center gap-4">
          <button 
            @click="$emit('navigate', 'calendar')"
            class="flex items-center justify-center p-2 rounded-full border-4 border-black bg-neo-blue shadow-neo hover:shadow-neo-hover hover:-translate-y-1 hover:-translate-x-1 transition-all"
          >
            <span class="material-symbols-outlined font-black text-black">arrow_back</span>
          </button>
          <h1 class="text-3xl md:text-4xl font-black uppercase tracking-tighter text-black dark:text-white">
            All Assignments
          </h1>
        </div>
        
        <button 
          @click="openTaskModal"
          class="flex items-center justify-center gap-2 border-4 border-black rounded-full bg-primary text-black px-6 py-3 font-black uppercase shadow-neo hover:shadow-neo-hover hover:translate-y-1 hover:translate-x-1 transition-all text-sm"
        >
          <span class="material-symbols-outlined font-black text-[18px]">add</span>
          New Task
        </button>
      </div>

      <!-- Filters -->
      <div class="flex items-center gap-4 overflow-x-auto pb-2">
        <span class="font-black uppercase text-sm tracking-wider dark:text-white text-black min-w-max">Filter:</span>
        <button 
          @click="activeFilter = activeFilter === 'HIGH PRIORITY' ? 'all' : 'HIGH PRIORITY'"
          :class="[
            'px-5 py-2 font-black text-xs md:text-sm uppercase transition-all tracking-wider rounded-xl',
            activeFilter === 'HIGH PRIORITY' ? 'bg-neo-pink border-4 border-black shadow-neo text-black' : 'bg-neo-pink/50 border-2 border-black/50 text-black/70 hover:bg-neo-pink hover:border-black hover:text-black dark:text-white dark:border-white/50'
          ]"
        >
          High Priority
        </button>
        <button 
          @click="activeFilter = activeFilter === 'MEDIUM' ? 'all' : 'MEDIUM'"
          :class="[
            'px-5 py-2 font-black text-xs md:text-sm uppercase transition-all tracking-wider rounded-xl',
            activeFilter === 'MEDIUM' ? 'bg-neo-orange border-4 border-black shadow-neo text-black' : 'bg-neo-orange/50 border-2 border-black/50 text-black/70 hover:bg-neo-orange hover:border-black hover:text-black dark:text-white dark:border-white/50'
          ]"
        >
          Medium
        </button>
        <button 
          @click="activeFilter = activeFilter === 'LOW' ? 'all' : 'LOW'"
          :class="[
            'px-5 py-2 font-black text-xs md:text-sm uppercase transition-all tracking-wider rounded-xl',
            activeFilter === 'LOW' ? 'bg-neo-blue border-4 border-black shadow-neo text-black' : 'bg-neo-blue/50 border-2 border-black/50 text-black/70 hover:bg-neo-blue hover:border-black hover:text-black dark:text-white dark:border-white/50'
          ]"
        >
          Low
        </button>
      </div>

      <!-- Task List -->
      <div class="flex flex-col gap-4 mt-2">
        
        <div 
          v-for="task in filteredTasks" 
          :key="task.id"
          :class="[
            'flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 md:p-6 border-[5px] border-black rounded-[2rem] transition-all',
            task.status === 'overdue' ? 'bg-neo-pink shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]' : 'bg-white dark:bg-slate-900 shadow-neo hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1'
          ]"
        >
          <div class="flex items-center gap-5">
            <button 
              @click="task.status = task.status === 'completed' ? 'pending' : 'completed'"
              :class="[
                'w-8 h-8 rounded-lg border-4 border-black flex items-center justify-center transition-all bg-white flex-shrink-0',
                task.status === 'completed' ? 'bg-neo-mint shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black' : 'hover:bg-gray-100 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1'
              ]"
            >
              <span v-if="task.status === 'completed'" class="material-symbols-outlined font-black text-[20px]">check</span>
            </button>
            <div class="flex flex-col gap-0.5">
              <h3 :class="[
                'font-black text-lg md:text-xl tracking-tight text-black dark:text-white',
                task.status === 'completed' ? 'line-through text-gray-500 dark:text-gray-400' : ''
              ]">
                {{ task.title }}
              </h3>
              <p :class="[
                'font-bold text-xs md:text-sm text-gray-600 dark:text-gray-400',
                task.status === 'completed' ? 'line-through' : ''
              ]">
                {{ task.time }}
              </p>
            </div>
          </div>
          
          <div 
            :class="[
              'px-4 py-1.5 border-4 border-black rounded-full font-black text-xs uppercase tracking-widest text-black self-start sm:self-auto flex items-center gap-1.5',
              task.priorityColor
            ]"
          >
            <span v-if="task.status === 'overdue'" class="material-symbols-outlined text-[14px]">warning</span>
            {{ task.priority }}
          </div>
        </div>

      </div>
    </div>

    <!-- Right Sidebar Area -->
    <aside class="w-full lg:w-[350px] xl:w-[400px] flex flex-col gap-6 flex-shrink-0">
      
      <!-- Study Streak -->
      <div 
        class="bg-gradient-to-br from-orange-400 via-red-500 to-yellow-400 border-[5px] border-black rounded-[2rem] shadow-neo p-5 text-white transform hover:translate-y-[-2px] hover:translate-x-[-2px] transition-all cursor-pointer relative overflow-hidden flex items-center justify-between"
      >
        <!-- Glow effect -->
        <div
          class="absolute -top-4 -right-4 w-20 h-20 bg-yellow-300 rounded-full opacity-30 blur-xl"
        ></div>
        <div
          class="absolute bottom-0 left-0 w-16 h-16 bg-orange-300 rounded-full opacity-20 blur-lg"
        ></div>

        <div class="flex flex-col z-10">
          <h3
            class="font-black uppercase text-sm text-yellow-100 tracking-wider mb-1 drop-shadow-[1px_1px_0px_rgba(0,0,0,0.5)]"
          >
            Study Streak
          </h3>
          <div class="flex items-baseline gap-2">
            <span
              class="text-4xl font-black leading-none drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)]"
              >12</span
            >
            <span
              class="font-bold uppercase tracking-wider text-xs text-yellow-100"
              >Days</span
            >
          </div>
        </div>
        <span
          class="material-symbols-outlined text-5xl font-black text-yellow-200 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)] animate-pulse z-10"
          >local_fire_department</span
        >
      </div>

      <!-- Progress Card -->
      <div class="bg-white dark:bg-slate-900 p-8 border-[5px] border-black rounded-[2rem] shadow-neo flex flex-col gap-6">
        <div class="flex items-center justify-between pb-4 border-b-4 border-black">
          <h2 class="font-black text-lg uppercase tracking-tight text-black dark:text-white">Progress</h2>
          <span class="material-symbols-outlined text-neo-orange font-black">trending_up</span>
        </div>

        <div class="flex flex-col gap-4">
          <!-- Completed -->
          <div class="flex flex-col gap-1.5">
            <div class="flex justify-between items-center text-xs font-black uppercase text-black dark:text-white tracking-wider">
              <span>Completed</span>
              <span class="text-gray-500">{{ stats.completed }}/{{ stats.total }}</span>
            </div>
            <div class="h-4 w-full bg-gray-200 border-2 border-black rounded-full relative overflow-hidden">
              <div 
                class="absolute top-0 left-0 h-full bg-neo-mint border-r-2 border-black"
                :style="`width: ${stats.completedPct}%`"
              ></div>
            </div>
          </div>

          <!-- Pending -->
          <div class="flex flex-col gap-1.5">
            <div class="flex justify-between items-center text-xs font-black uppercase text-black dark:text-white tracking-wider">
              <span>Pending</span>
              <span class="text-gray-500">{{ stats.pending }}/{{ stats.total }}</span>
            </div>
            <div class="h-4 w-full bg-gray-200 border-2 border-black rounded-full relative overflow-hidden">
              <div 
                class="absolute top-0 left-0 h-full bg-primary border-r-2 border-black"
                :style="`width: ${stats.pendingPct}%`"
              ></div>
            </div>
          </div>

          <!-- Overdue -->
          <div class="flex flex-col gap-1.5">
            <div class="flex justify-between items-center text-xs font-black uppercase text-black dark:text-white tracking-wider">
              <span>Overdue</span>
              <span class="text-gray-500">{{ stats.overdue }}/{{ stats.total }}</span>
            </div>
            <div class="h-4 w-full bg-gray-200 border-2 border-black rounded-full relative overflow-hidden">
              <div 
                class="absolute top-0 left-0 h-full bg-neo-pink border-r-2 border-black"
                :style="`width: ${stats.overduePct}%`"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Return Button Card -->
      <button 
        @click="$emit('navigate', 'calendar')"
        class="bg-white dark:bg-slate-900 border-[5px] border-black rounded-[2rem] shadow-neo hover:shadow-neo-hover hover:translate-y-1 hover:translate-x-1 p-8 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group"
      >
        <span class="material-symbols-outlined text-4xl font-black text-black group-hover:scale-110 transition-transform">event</span>
        <span class="font-black text-sm uppercase tracking-widest text-black">Return To Calendar</span>
      </button>

    </aside>

    <!-- Create Task Modal -->
    <div
      v-if="showTaskModal"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      @click.self="closeTaskModal"
    >
      <div
        class="w-full max-w-lg bg-white dark:bg-slate-900 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200"
      >
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-4 bg-primary border-b-4 border-black">
          <h3 class="font-black uppercase text-2xl text-black tracking-tight">
            New Task
          </h3>
          <button
            @click="closeTaskModal"
            class="w-8 h-8 flex items-center justify-center bg-red-500 border-2 border-black hover:shadow-neo transition-all"
          >
            <span class="material-symbols-outlined font-black text-white text-sm">close</span>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="px-4 pb-2 mt-4 flex flex-col gap-4">
          <!-- Title -->
          <div class="flex flex-col gap-1">
            <label class="font-black uppercase text-xs text-gray-500 dark:text-gray-400">Task Title *</label>
            <input
              v-model="newTask.title"
              type="text"
              placeholder="e.g. CS301 Extra Credit"
              class="w-full border-2 border-black rounded py-2 px-3 font-bold text-black dark:text-white bg-white dark:bg-slate-800 focus:shadow-neo focus:outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          <!-- Priority & Deadline Row -->
          <div class="flex gap-4">
            <!-- Priority (Color Picker as pills) -->
            <div class="flex flex-col gap-1 flex-1">
              <label class="font-black uppercase text-xs text-gray-500 dark:text-gray-400">Priority</label>
              <div class="flex flex-col gap-2">
                <button
                  v-for="opt in priorityOptions"
                  :key="opt.value"
                  @click="newTask.priority = opt.value; newTask.priorityColor = opt.color"
                  :class="[
                    'flex items-center justify-between px-4 py-3 border-2 text-sm font-black uppercase transition-all',
                    newTask.priority === opt.value
                      ? `border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] scale-[1.02] ${opt.color}`
                      : 'border-gray-300 hover:border-black opacity-70 hover:opacity-100 bg-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px]',
                  ]"
                >
                  <div class="flex items-center gap-3">
                    <div :class="`w-4 h-4 border-2 border-black rounded-full ${opt.color}`"></div>
                    <span class="text-black">{{ opt.label }}</span>
                  </div>
                  <span
                    v-if="newTask.priority === opt.value"
                    class="material-symbols-outlined text-black font-black"
                    style="font-size: 18px"
                  >check</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Deadline Row: Date + Time -->
          <div class="flex flex-col gap-1">
            <label class="font-black uppercase text-xs text-gray-500 dark:text-gray-400">Deadline (Optional)</label>
            <div class="flex gap-2">
              <input
                v-model="newTask.date"
                type="date"
                class="flex-1 border-2 border-black rounded py-2 px-3 font-bold text-sm text-black dark:text-white bg-white dark:bg-slate-800 focus:shadow-neo focus:outline-none transition-all"
              />
              <input
                v-model="newTask.time"
                type="time"
                class="w-24 border-2 border-black rounded py-2 px-2 font-bold text-sm text-black dark:text-white bg-white dark:bg-slate-800 focus:shadow-neo focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <!-- Save Button (Full Width) -->
        <div class="p-4 mt-2">
          <button
            @click="createTask"
            :disabled="!newTask.title"
            :class="[
              'w-full py-3 border-4 border-black font-black uppercase text-lg tracking-wide transition-all flex items-center justify-center gap-2',
              newTask.title
                ? 'bg-neo-mint text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed',
            ]"
          >
            Create Task
            <span class="material-symbols-outlined font-black">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* Scoped styles mainly handled by tailwind classes */
</style>

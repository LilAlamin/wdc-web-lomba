<template>
  <div class="flex-1 px-10 pb-10 max-w-[1600px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">

    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-6 mb-10">
      <div class="flex items-center gap-4">
        <button
          @click="$emit('back')"
          class="size-14 border-4 border-black bg-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center justify-center active:bg-gray-200"
        >
          <span class="material-symbols-outlined font-black text-2xl">arrow_back</span>
        </button>
        <div>
          <h1 class="text-4xl md:text-5xl font-black uppercase tracking-tighter">Achievements</h1>
          <p class="font-bold text-gray-500">{{ unlockedCount }} of {{ achievements.length }} unlocked</p>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="flex items-center gap-4 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl px-6 py-4 min-w-[280px]">
        <span class="material-symbols-outlined font-black text-3xl text-primary">military_tech</span>
        <div class="flex-1">
          <div class="flex justify-between items-center mb-2">
            <span class="font-black uppercase text-sm">Progress</span>
            <span class="font-black text-lg">{{ Math.round((unlockedCount / achievements.length) * 100) }}%</span>
          </div>
          <div class="w-full h-5 bg-gray-200 border-2 border-black rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-primary to-neo-pink border-r-2 border-black rounded-full transition-all duration-1000 ease-out"
              :style="{ width: `${(unlockedCount / achievements.length) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-3 mb-8 flex-wrap">
      <button
        v-for="tab in filterTabs"
        :key="tab.value"
        @click="activeFilter = tab.value"
        :class="[
          'px-5 py-2.5 border-4 border-black font-black uppercase text-sm rounded-xl transition-all cursor-pointer',
          activeFilter === tab.value
            ? `${tab.activeColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1`
            : 'bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Achievements Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="(achievement, index) in filteredAchievements"
        :key="achievement.id"
        :class="[
          'border-4 border-black rounded-2xl p-6 flex flex-col items-center text-center gap-4 transition-all duration-300 cursor-pointer group relative overflow-hidden',
          achievement.unlocked
            ? 'bg-white hover:-translate-y-3 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
            : 'bg-gray-100 border-dashed opacity-60 hover:opacity-90 hover:-translate-y-1'
        ]"
        :style="{ animationDelay: `${index * 80}ms` }"
        class="animate-in fade-in slide-in-from-bottom-2"
        @click="achievement.unlocked ? openDetail(achievement) : null"
      >
        <!-- Rarity badge -->
        <div
          v-if="achievement.unlocked"
          :class="[
            'absolute top-3 right-3 px-2 py-1 border-2 border-black text-[10px] font-black uppercase rounded-lg',
            rarityColor(achievement.rarity)
          ]"
        >
          {{ achievement.rarity }}
        </div>

        <!-- Icon -->
        <div
          :class="[
            'size-20 rounded-full border-4 border-black flex items-center justify-center transition-all duration-300',
            achievement.unlocked
              ? `${achievement.bgColor} shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] group-hover:scale-110 group-hover:rotate-6`
              : 'bg-gray-300'
          ]"
        >
          <span
            :class="[
              'material-symbols-outlined font-black text-4xl',
              achievement.unlocked ? 'text-black' : 'text-gray-500'
            ]"
          >{{ achievement.unlocked ? achievement.icon : 'lock' }}</span>
        </div>

        <!-- Title -->
        <h3 :class="[
          'font-black uppercase tracking-wider text-sm',
          achievement.unlocked ? '' : 'text-gray-500'
        ]">
          {{ achievement.title }}
        </h3>

        <!-- Description -->
        <p class="text-xs font-bold text-gray-500 leading-relaxed">
          {{ achievement.description }}
        </p>

        <!-- Unlock date -->
        <span v-if="achievement.unlocked" class="text-[10px] font-bold text-gray-400 uppercase mt-auto pt-2 border-t-2 border-gray-200 w-full">
          Unlocked {{ achievement.date }}
        </span>

        <!-- Progress bar for locked -->
        <div v-if="!achievement.unlocked && achievement.progress !== undefined" class="w-full mt-auto">
          <div class="flex justify-between text-[10px] font-black text-gray-500 mb-1">
            <span>Progress</span>
            <span>{{ achievement.progress }}%</span>
          </div>
          <div class="w-full h-3 bg-gray-300 border-2 border-black rounded-full overflow-hidden">
            <div
              class="h-full bg-gray-500 rounded-full transition-all"
              :style="{ width: `${achievement.progress}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Achievement Detail Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="selectedAchievement"
          class="fixed inset-0 z-[200] flex items-center justify-center p-4"
        >
          <div class="absolute inset-0 bg-black/60 backdrop-blur-md" @click="selectedAchievement = null"></div>
          <div class="relative w-full max-w-sm bg-white border-[6px] border-black rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center overflow-hidden modal-enter">
            
            <!-- Badge Header -->
            <div :class="[
              'w-full py-10 flex flex-col items-center gap-4 border-b-[6px] border-black relative overflow-hidden',
              selectedAchievement.bgColor
            ]">
              <!-- Decorative -->
              <div class="absolute -top-6 -left-6 size-20 bg-white/20 border-4 border-black rounded-full"></div>
              <div class="absolute -bottom-8 -right-8 size-24 bg-black/10 border-4 border-black rounded-full"></div>

              <div class="size-28 rounded-full border-[6px] border-black bg-white flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative z-10 animate-bounce-slow">
                <span class="material-symbols-outlined font-black text-6xl text-black">{{ selectedAchievement.icon }}</span>
              </div>
              <div :class="[
                'px-3 py-1 border-2 border-black text-xs font-black uppercase rounded-lg',
                rarityColor(selectedAchievement.rarity)
              ]">
                {{ selectedAchievement.rarity }}
              </div>
            </div>

            <!-- Detail Body -->
            <div class="p-8 flex flex-col gap-3">
              <h2 class="text-2xl font-black uppercase tracking-tight">{{ selectedAchievement.title }}</h2>
              <p class="font-bold text-gray-500 leading-relaxed">{{ selectedAchievement.description }}</p>
              <span class="text-xs font-bold text-gray-400 uppercase mt-2">Unlocked {{ selectedAchievement.date }}</span>
            </div>

            <div class="px-8 pb-8 w-full">
              <button
                @click="selectedAchievement = null"
                class="w-full py-3 border-4 border-black bg-white font-black uppercase rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all active:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

defineEmits(['back']);

const activeFilter = ref('all');

const filterTabs = [
  { label: 'All', value: 'all', activeColor: 'bg-primary' },
  { label: 'Unlocked', value: 'unlocked', activeColor: 'bg-neo-mint' },
  { label: 'Locked', value: 'locked', activeColor: 'bg-gray-300' },
  { label: 'Rare', value: 'rare', activeColor: 'bg-neo-pink' },
];

const achievements = ref([
  { id: 1, title: 'Firestarter', icon: 'local_fire_department', bgColor: 'bg-yellow-300', description: 'Complete your first 10 tasks in a single day. Stay on fire!', unlocked: true, date: 'Nov 15, 2026', rarity: 'Common' },
  { id: 2, title: 'Bookworm', icon: 'menu_book', bgColor: 'bg-cyan-400', description: 'Read and summarize 50 chapters of study material across all subjects.', unlocked: true, date: 'Oct 28, 2026', rarity: 'Common' },
  { id: 3, title: 'Debugger', icon: 'bug_report', bgColor: 'bg-neo-mint', description: 'Fix 25 errors in your coding assignments without any external help.', unlocked: true, date: 'Dec 1, 2026', rarity: 'Uncommon' },
  { id: 4, title: 'Night Owl', icon: 'dark_mode', bgColor: 'bg-indigo-400', description: 'Study for 5+ hours between midnight and 6 AM.', unlocked: false, progress: 72, rarity: 'Uncommon' },
  { id: 5, title: 'Speedrunner', icon: 'speed', bgColor: 'bg-red-400', description: 'Submit an assignment within 1 hour of it being posted.', unlocked: true, date: 'Sep 10, 2026', rarity: 'Rare' },
  { id: 6, title: 'Perfectionist', icon: 'stars', bgColor: 'bg-neo-pink', description: 'Get a perfect score on 3 consecutive assignments.', unlocked: true, date: 'Nov 22, 2026', rarity: 'Rare' },
  { id: 7, title: 'Marathon Runner', icon: 'directions_run', bgColor: 'bg-orange-400', description: 'Maintain a study streak of 30 days straight without missing a day.', unlocked: false, progress: 40, rarity: 'Epic' },
  { id: 8, title: 'Team Player', icon: 'groups', bgColor: 'bg-blue-400', description: 'Participate in 20 study group sessions with your classmates.', unlocked: true, date: 'Oct 5, 2026', rarity: 'Common' },
  { id: 9, title: 'Early Bird', icon: 'wb_sunny', bgColor: 'bg-amber-300', description: 'Start studying before 6 AM for 10 consecutive days.', unlocked: false, progress: 30, rarity: 'Uncommon' },
  { id: 10, title: 'Code Ninja', icon: 'code', bgColor: 'bg-slate-700 text-white', description: 'Write over 10,000 lines of code across all your projects.', unlocked: false, progress: 85, rarity: 'Epic' },
  { id: 11, title: 'Scholar', icon: 'school', bgColor: 'bg-purple-400', description: 'Achieve a GPA of 3.8 or higher for two consecutive semesters.', unlocked: true, date: 'Aug 20, 2026', rarity: 'Legendary' },
  { id: 12, title: 'Multitasker', icon: 'hub', bgColor: 'bg-teal-400', description: 'Work on 5 different subjects in a single study session.', unlocked: false, progress: 60, rarity: 'Rare' },
]);

const unlockedCount = computed(() => achievements.value.filter(a => a.unlocked).length);

const filteredAchievements = computed(() => {
  if (activeFilter.value === 'unlocked') return achievements.value.filter(a => a.unlocked);
  if (activeFilter.value === 'locked') return achievements.value.filter(a => !a.unlocked);
  if (activeFilter.value === 'rare') return achievements.value.filter(a => ['Rare', 'Epic', 'Legendary'].includes(a.rarity));
  return achievements.value;
});

const rarityColor = (rarity) => {
  const map = {
    'Common': 'bg-gray-200',
    'Uncommon': 'bg-green-300',
    'Rare': 'bg-blue-300',
    'Epic': 'bg-purple-300',
    'Legendary': 'bg-amber-300',
  };
  return map[rarity] || 'bg-gray-200';
};

const selectedAchievement = ref(null);

const openDetail = (achievement) => {
  selectedAchievement.value = achievement;
};
</script>

<style scoped>
.modal-enter {
  animation: modalBounceIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalBounceIn {
  0% { opacity: 0; transform: scale(0.8) translateY(30px); }
  60% { transform: scale(1.02) translateY(-4px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

.animate-bounce-slow {
  animation: bounceSlow 2s ease-in-out infinite;
}

@keyframes bounceSlow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
</style>

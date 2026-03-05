<template>
  <div
    class="flex-1 px-10 pb-10 max-w-[1600px] mx-auto w-full flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
  >
    <!-- Left Column (Main Info & Stats) -->
    <div class="flex-1 flex flex-col gap-8">
      <!-- User Info Card -->
      <div
        class="relative bg-white dark:bg-slate-900 border-[6px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-[2.5rem] p-8 overflow-hidden hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all group"
      >
        <!-- Decorative shape -->
        <div
          class="absolute -top-12 -right-12 size-36 bg-cyan-300 border-[6px] border-black rounded-[2.5rem] rotate-12 transition-all duration-500 group-hover:scale-125 group-hover:rotate-45"
        ></div>

        <div class="flex items-center gap-8 relative z-10 flex-col sm:flex-row text-center sm:text-left">
          <div
            class="relative size-36 bg-[#F3D5B5] border-[6px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-full overflow-hidden flex items-end justify-center transition-transform group-hover:scale-105"
          >
            <!-- Avatar representation (Default) -->
            <div
              v-if="!profileImageUrl"
              class="w-20 h-24 bg-slate-800 rounded-t-full relative flex flex-col items-center"
            >
              <div
                class="absolute -top-6 w-14 h-16 bg-[#F3D5B5] rounded-full border-b-[3px] border-black/10"
              ></div>
              <div
                class="absolute top-8 w-2 h-12 bg-white border-x-[3px] border-black rounded-sm"
              ></div>
            </div>
            
            <!-- Uploaded Avatar Image -->
            <img v-else :src="profileImageUrl" class="w-full h-full object-cover" />
          </div>
          <div class="flex-1 flex flex-col gap-3">
            <h1 class="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight">
              {{ userName }}
            </h1>
            <div>
              <div
                class="inline-block border-4 border-black bg-white px-4 py-2 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all truncate max-w-full"
              >
                {{ userUniversity }}
              </div>
            </div>
            <!-- Edit Profile Button -->
            <div class="mt-2">
              <button
                @click="openEditModal"
                class="inline-flex items-center gap-2 border-4 border-black bg-primary px-5 py-2.5 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] active:bg-black active:text-white transition-all rounded-lg cursor-pointer"
              >
                <span class="material-symbols-outlined font-bold text-lg">edit</span>
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div
          class="bg-yellow-300 border-4 border-black shadow-neo rounded-xl p-6 hover:-translate-y-2 hover:shadow-neo-hover transition-all duration-300 cursor-pointer group"
        >
          <div class="flex justify-between items-start mb-4">
            <h3 class="font-black uppercase text-sm">Tasks Completed</h3>
            <div class="border-2 border-black rounded-full bg-white p-1 group-hover:rotate-12 transition-transform">
              <span class="material-symbols-outlined font-black text-black text-sm block">check</span>
            </div>
          </div>
          <div class="text-6xl font-black group-hover:scale-110 origin-left transition-transform">142</div>
        </div>

        <div
          class="bg-neo-mint border-4 border-black shadow-neo rounded-xl p-6 hover:-translate-y-2 hover:shadow-neo-hover transition-all duration-300 cursor-pointer group"
        >
          <div class="flex justify-between items-start mb-4">
            <h3 class="font-black uppercase text-sm">Study Hours</h3>
            <span class="material-symbols-outlined font-black group-hover:animate-spin">schedule</span>
          </div>
          <div class="text-6xl font-black group-hover:scale-110 origin-left transition-transform">380</div>
        </div>

        <div
          class="bg-orange-400 border-4 border-black shadow-neo rounded-xl p-6 hover:-translate-y-2 hover:shadow-neo-hover transition-all duration-300 cursor-pointer group sm:col-span-2 md:col-span-1"
        >
          <div class="flex justify-between items-start mb-4">
            <h3 class="font-black uppercase text-sm">Current Rank</h3>
            <span class="material-symbols-outlined font-black group-hover:animate-bounce">emoji_events</span>
          </div>
          <div class="text-6xl font-black group-hover:scale-110 origin-left transition-transform">#4</div>
        </div>
      </div>

      <!-- Achievements -->
      <div
        class="bg-white dark:bg-slate-900 border-4 border-black shadow-neo rounded-xl p-8"
      >
        <div class="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
          <h2 class="text-2xl font-black uppercase">Achievements</h2>
          <button
            class="border-4 border-black px-4 py-2 font-bold uppercase transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-black hover:text-white"
          >
            View All
          </button>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            class="border-4 border-black rounded-xl p-6 flex flex-col items-center justify-center gap-4 hover:-translate-y-2 hover:shadow-neo transition-all cursor-pointer bg-white group hover:bg-yellow-100"
          >
            <div
              class="size-16 rounded-full border-4 border-black bg-yellow-300 flex items-center justify-center group-hover:animate-pulse shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <span class="material-symbols-outlined font-black text-black text-3xl"
                >local_fire_department</span
              >
            </div>
            <span class="font-black uppercase tracking-wider text-sm">Firestarter</span>
          </div>
          <div
            class="border-4 border-black rounded-xl p-6 flex flex-col items-center justify-center gap-4 hover:-translate-y-2 hover:shadow-neo transition-all cursor-pointer bg-white group hover:bg-cyan-100"
          >
            <div
              class="size-16 rounded-full border-4 border-black bg-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <span class="material-symbols-outlined font-black text-black text-3xl"
                >menu_book</span
              >
            </div>
            <span class="font-black uppercase tracking-wider text-sm">Bookworm</span>
          </div>
          <div
            class="border-4 border-black rounded-xl p-6 flex flex-col items-center justify-center gap-4 hover:-translate-y-2 hover:shadow-neo transition-all cursor-pointer bg-white group hover:bg-neo-mint"
          >
            <div
              class="size-16 rounded-full border-4 border-black bg-neo-mint flex items-center justify-center group-hover:-rotate-12 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <span class="material-symbols-outlined font-black text-black text-3xl"
                >bug_report</span
              >
            </div>
            <span class="font-black uppercase tracking-wider text-sm">Debugger</span>
          </div>
          <div
            class="border-4 border-black rounded-xl p-6 flex flex-col items-center justify-center gap-4 border-dashed opacity-50 hover:opacity-100 transition-all cursor-pointer bg-gray-50 hover:bg-gray-100 hover:-translate-y-1 group"
          >
            <div
              class="size-16 rounded-full border-4 border-black bg-gray-200 flex items-center justify-center group-hover:bg-black transition-colors"
            >
              <span class="material-symbols-outlined font-black text-gray-500 group-hover:text-white transition-colors text-3xl"
                >lock</span
              >
            </div>
            <span class="font-black uppercase tracking-wider text-sm text-gray-500 group-hover:text-black">Night Owl</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Sidebar -->
    <div class="w-full lg:w-96 flex flex-col gap-8">
      <!-- Study Streak -->
      <div
        class="bg-gradient-to-br from-[#f06144] to-[#f3a446] border-[6px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-[3.5rem] p-10 flex flex-col items-start relative overflow-hidden group cursor-pointer hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 text-white"
      >
        <h3 class="font-black uppercase tracking-wider text-4xl mb-6 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">
          Study Streak
        </h3>
        <div class="flex items-center gap-6 pl-4">
          <span
            class="material-symbols-outlined text-[5rem] font-black text-[#facc91] drop-shadow-[3px_3px_0px_rgba(180,50,30,0.6)] group-hover:scale-110 group-hover:rotate-12 transition-all duration-300"
            style="font-variation-settings: 'FILL' 1"
            >local_fire_department</span
          >
          <div class="flex flex-col">
            <span class="text-[5.5rem] font-black leading-none drop-shadow-[3px_3px_0px_rgba(0,0,0,0.3)] mb-2">12</span>
            <span class="font-black uppercase text-2xl tracking-widest drop-shadow-[1px_1px_0px_rgba(0,0,0,0.3)]"
              >Days Strong</span
            >
          </div>
        </div>
      </div>

      <!-- Upcoming Goals -->
      <div
        class="bg-white dark:bg-slate-900 border-4 border-black shadow-neo rounded-xl p-8 flex-1 flex flex-col"
      >
        <div
          class="flex justify-between items-center border-b-4 border-black pb-4 mb-6"
        >
          <h2 class="text-xl font-black uppercase">Upcoming Goals</h2>
          <span class="material-symbols-outlined font-black text-orange-400 text-3xl animate-pulse"
            >flag</span
          >
        </div>

        <div class="flex flex-col gap-4 flex-1">
          <label
            class="flex items-center gap-4 border-4 border-black rounded-lg p-4 cursor-pointer hover:bg-yellow-50 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all group"
          >
            <div class="relative flex items-center justify-center">
              <input
                type="checkbox"
                class="peer appearance-none size-8 border-4 border-black rounded bg-white checked:bg-black transition-colors"
              />
              <span
                class="material-symbols-outlined absolute text-white opacity-0 peer-checked:opacity-100 font-black pointer-events-none scale-0 peer-checked:scale-100 transition-transform"
                >check</span
              >
            </div>
            <div class="flex flex-col group-hover:translate-x-1 transition-transform">
              <span class="font-black uppercase">Finish CS301 Project</span>
              <span class="text-sm font-bold text-gray-500">2 days left</span>
            </div>
          </label>

          <label
            class="flex items-center gap-4 border-4 border-black rounded-lg p-4 cursor-pointer hover:bg-cyan-50 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all group"
          >
            <div class="relative flex items-center justify-center">
              <input
                type="checkbox"
                class="peer appearance-none size-8 border-4 border-black rounded bg-white checked:bg-black transition-colors"
              />
              <span
                class="material-symbols-outlined absolute text-white opacity-0 peer-checked:opacity-100 font-black pointer-events-none scale-0 peer-checked:scale-100 transition-transform"
                >check</span
              >
            </div>
            <div class="flex flex-col group-hover:translate-x-1 transition-transform">
              <span class="font-black uppercase">Read Chapter 5</span>
              <span class="text-sm font-bold text-gray-500">Tonight</span>
            </div>
          </label>

          <label
            class="flex items-center gap-4 border-4 border-black rounded-lg p-4 cursor-pointer hover:bg-neo-mint/20 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all group"
          >
            <div class="relative flex items-center justify-center">
              <input
                type="checkbox"
                class="peer appearance-none size-8 border-4 border-black rounded bg-white checked:bg-black transition-colors"
                checked
              />
              <span
                class="material-symbols-outlined absolute text-white opacity-0 peer-checked:opacity-100 font-black pointer-events-none scale-0 peer-checked:scale-100 transition-transform"
                >check</span
              >
            </div>
            <div class="flex flex-col group-hover:translate-x-1 transition-transform opacity-50 line-through">
              <span class="font-black uppercase">Math Problem Set</span>
              <span class="text-sm font-bold text-gray-500">Tomorrow</span>
            </div>
          </label>
        </div>

        <button
          class="w-full mt-6 border-4 border-black py-4 font-black uppercase text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] hover:bg-primary active:bg-black active:text-white transition-all"
        >
          Add New Goal
        </button>
      </div>
    </div>

    <!-- ==================== EDIT PROFILE MODAL ==================== -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="isEditModalOpen"
          class="fixed inset-0 z-[200] flex items-center justify-center p-4"
        >
          <!-- Backdrop -->
          <div
            class="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
            @click="closeEditModal"
          ></div>

          <!-- Modal Panel -->
          <div
            class="relative w-full max-w-lg bg-white dark:bg-slate-900 border-[6px] border-black rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden modal-enter"
          >
            <!-- Modal Header with gradient -->
            <div class="relative bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] p-8 border-b-[6px] border-black overflow-hidden">
              <!-- Decorative circles -->
              <div class="absolute -top-6 -left-6 size-20 bg-[#fde68a] border-4 border-black rounded-full opacity-50"></div>
              <div class="absolute -bottom-8 -right-8 size-28 bg-[#f97316] border-4 border-black rounded-full opacity-30"></div>
              <div class="absolute top-4 right-20 size-8 bg-white/40 border-2 border-black rounded-full opacity-50"></div>

              <div class="relative z-10 flex items-center justify-between">
                <div>
                  <h2 class="text-3xl font-black uppercase tracking-tight text-black">Edit Profile</h2>
                  <p class="font-bold text-black/60 mt-1">Update your personal info</p>
                </div>
                <button
                  @click="closeEditModal"
                  class="size-12 bg-white border-4 border-black rounded-xl flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all active:bg-red-400"
                >
                  <span class="material-symbols-outlined font-black text-black">close</span>
                </button>
              </div>
            </div>

            <!-- Modal Body -->
            <div class="p-8 flex flex-col gap-8">
              <!-- Avatar Upload Section -->
              <div class="flex items-center gap-6">
                <div
                  class="relative size-28 bg-[#F3D5B5] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-full overflow-hidden flex items-end justify-center flex-shrink-0 group cursor-pointer hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all"
                >
                  <div v-if="!editForm.tempImageUrl" class="w-16 h-20 bg-slate-800 rounded-t-full relative flex flex-col items-center">
                    <div class="absolute -top-5 w-11 h-12 bg-[#F3D5B5] rounded-full border-b-2 border-black/10"></div>
                    <div class="absolute top-7 w-2 h-10 bg-white border-x-2 border-black rounded-sm"></div>
                  </div>
                  <img v-else :src="editForm.tempImageUrl" class="w-full h-full object-cover" />

                  <!-- Overlay -->
                  <label class="absolute inset-0 bg-black/60 text-white font-black uppercase text-xs flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer rounded-full">
                    <span class="material-symbols-outlined text-2xl mb-0.5">photo_camera</span>
                    Change
                    <input type="file" class="hidden" @change="handleImageUpload" accept="image/*" />
                  </label>
                </div>
                <div class="flex flex-col gap-2">
                  <span class="font-black uppercase text-sm">Profile Photo</span>
                  <label
                    class="inline-flex items-center gap-2 border-4 border-black bg-neo-pink px-4 py-2 font-bold text-sm uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all cursor-pointer rounded-lg"
                  >
                    <span class="material-symbols-outlined text-sm font-bold">upload</span>
                    Upload Photo
                    <input type="file" class="hidden" @change="handleImageUpload" accept="image/*" />
                  </label>
                  <button
                    v-if="editForm.tempImageUrl"
                    @click="editForm.tempImageUrl = null"
                    class="text-xs font-bold text-red-500 uppercase hover:underline text-left"
                  >
                    Remove Photo
                  </button>
                </div>
              </div>

              <!-- Name Input -->
              <div class="flex flex-col gap-2">
                <label class="font-black uppercase text-sm flex items-center gap-2">
                  <span class="material-symbols-outlined text-lg">badge</span>
                  Full Name
                </label>
                <input
                  v-model="editForm.userName"
                  class="w-full border-4 border-black bg-gray-50 rounded-xl p-4 font-bold text-lg focus:outline-none focus:bg-yellow-50 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 transition-all placeholder:text-gray-400"
                  placeholder="Enter your name"
                />
              </div>

              <!-- University Input -->
              <div class="flex flex-col gap-2">
                <label class="font-black uppercase text-sm flex items-center gap-2">
                  <span class="material-symbols-outlined text-lg">school</span>
                  University / Role
                </label>
                <input
                  v-model="editForm.userUniversity"
                  class="w-full border-4 border-black bg-gray-50 rounded-xl p-4 font-bold text-lg focus:outline-none focus:bg-cyan-50 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 transition-all placeholder:text-gray-400"
                  placeholder="e.g. Computer Science @ MIT"
                />
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="px-8 pb-8 flex justify-end gap-4">
              <button
                @click="closeEditModal"
                class="px-8 py-3 border-4 border-black bg-white font-black uppercase rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all active:bg-gray-200"
              >
                Cancel
              </button>
              <button
                @click="saveProfile"
                class="px-8 py-3 border-4 border-black bg-neo-mint font-black uppercase rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all active:bg-green-400 flex items-center gap-2"
              >
                <span class="material-symbols-outlined font-bold">check</span>
                Save
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const userName = ref("Andi Pratama");
const userUniversity = ref("Computer Science @ Univ Indonesia");
const profileImageUrl = ref(null);

const isEditModalOpen = ref(false);
const editForm = ref({
  userName: "",
  userUniversity: "",
  tempImageUrl: null
});

const openEditModal = () => {
  editForm.value = {
    userName: userName.value,
    userUniversity: userUniversity.value,
    tempImageUrl: profileImageUrl.value
  };
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    editForm.value.tempImageUrl = URL.createObjectURL(file);
  }
};

const saveProfile = () => {
  userName.value = editForm.value.userName;
  userUniversity.value = editForm.value.userUniversity;
  profileImageUrl.value = editForm.value.tempImageUrl;
  closeEditModal();
};
</script>

<style scoped>
/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.9) translateY(20px);
}

.modal-enter {
  animation: modalBounceIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalBounceIn {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(30px);
  }
  60% {
    transform: scale(1.02) translateY(-4px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>

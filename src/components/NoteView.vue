<script setup>
import { ref, computed, watch } from "vue";

// --- State for Folders/Subjects ---
const subjects = ref([
  {
    id: 1,
    name: "PHYSICS 101",
    color: "bg-[#b682ff]",
    active: true,
    icon: "book",
    notes: [
      {
        id: 101,
        title: "KINEMATICS",
        content:
          "Kinematics is the branch of mechanics that describes the motion of points, bodies (objects), and systems of bodies without considering the forces that cause them to move.\n\n- Displacement vs Distance\n- Velocity vs Speed\n- Acceleration\n\nRemember to review the equations of motion for the upcoming quiz!",
      },
      {
        id: 102,
        title: "DYNAMICS",
        content: "Newton's laws of motion...",
      },
    ],
  },
  {
    id: 2,
    name: "HISTORY SEM",
    color: "bg-primary",
    active: false,
    icon: "history_edu",
    notes: [
      {
        id: 201,
        title: "WORLD WAR II",
        content: "Key events and timeline of WWII...",
      },
    ],
  },
  {
    id: 3,
    name: "COMP SCI",
    color: "bg-[#67a3ff]",
    active: false,
    icon: "code",
    notes: [
      {
        id: 301,
        title: "DATA STRUCTURES",
        content: "Arrays, Linked Lists, Trees, and Graphs.",
      },
    ],
  },
]);

// Available colors for new folders
const folderColors = [
  "bg-[#b682ff]",
  "bg-primary",
  "bg-[#67a3ff]",
  "bg-neo-pink",
  "bg-neo-mint",
  "bg-neo-orange",
];

const activeNoteId = ref(101); // Default active note

const activateSubject = (id) => {
  subjects.value.forEach((s) => (s.active = s.id === id));
  const activeSubj = subjects.value.find((s) => s.id === id);
  if (activeSubj && activeSubj.notes.length > 0) {
    activeNoteId.value = activeSubj.notes[0].id;
  } else {
    activeNoteId.value = null;
  }
};

const activeSubject = computed(() => subjects.value.find((s) => s.active));
const activeNote = computed(() => {
  if (!activeSubject.value) return null;
  return (
    activeSubject.value.notes.find((n) => n.id === activeNoteId.value) ||
    activeSubject.value.notes[0]
  );
});

// --- Modal State for Add Folder ---
const isAddingFolder = ref(false);
const newFolderName = ref("");
const newFolderIcon = ref("folder"); // Default icon

const availableIcons = [
  "folder",
  "book",
  "history_edu",
  "code",
  "science",
  "calculate",
  "language",
  "music_note",
  "palette",
  "fitness_center",
  "engineering",
];

const openAddFolderModal = () => {
  newFolderName.value = "";
  newFolderIcon.value = "folder";
  isAddingFolder.value = true;
};

const cancelAddFolder = () => {
  isAddingFolder.value = false;
};

const confirmAddFolder = () => {
  if (newFolderName.value.trim()) {
    const newId = Date.now();
    const randomColor =
      folderColors[Math.floor(Math.random() * folderColors.length)];
    const initialNoteId = Date.now() + 1;
    subjects.value.push({
      id: newId,
      name: newFolderName.value.trim().toUpperCase(),
      color: randomColor,
      active: false,
      icon: newFolderIcon.value,
      notes: [
        {
          id: initialNoteId,
          title: "NEW NOTE",
          content: "Start typing your note here...",
        },
      ],
    });
    activateSubject(newId);
  }
  isAddingFolder.value = false;
};

const addNewNote = () => {
  if (activeSubject.value) {
    const noteId = Date.now();
    activeSubject.value.notes.push({
      id: noteId,
      title: "NEW TAB",
      content: "",
    });
    activeNoteId.value = noteId;
  }
};

const activateNoteTab = (noteId) => {
  activeNoteId.value = noteId;
};

// --- Modal State for Delete Confirmation ---
const isConfirmingDelete = ref(false);
const deleteTargetType = ref(null); // 'folder' or 'note'
const deleteTargetId = ref(null);

const confirmDelete = (type, id) => {
  deleteTargetType.value = type;
  deleteTargetId.value = id;
  isConfirmingDelete.value = true;
};

const cancelDelete = () => {
  isConfirmingDelete.value = false;
  deleteTargetType.value = null;
  deleteTargetId.value = null;
};

const executeDelete = () => {
  if (deleteTargetType.value === "folder") {
    const id = deleteTargetId.value;
    subjects.value = subjects.value.filter((s) => s.id !== id);
    if (activeSubject.value === undefined && subjects.value.length > 0) {
      activateSubject(subjects.value[0].id);
    } else if (subjects.value.length === 0) {
      activeNoteId.value = null;
    }
  } else if (deleteTargetType.value === "note") {
    const noteId = deleteTargetId.value;
    if (activeSubject.value) {
      activeSubject.value.notes = activeSubject.value.notes.filter(
        (n) => n.id !== noteId,
      );
      if (activeNoteId.value === noteId) {
        if (activeSubject.value.notes.length > 0) {
          activeNoteId.value = activeSubject.value.notes[0].id;
        } else {
          activeNoteId.value = null;
        }
      }
    }
  }
  cancelDelete();
};

const deleteFolder = (id, event) => {
  event.stopPropagation();
  confirmDelete("folder", id);
};

const deleteNoteTab = (noteId, event) => {
  event.stopPropagation();
  confirmDelete("note", noteId);
};

// --- Toolbar State ---
const highlightActive = ref(false);
const boldActive = ref(false);
const italicActive = ref(false);
const listActive = ref(false);
const orderedListActive = ref(false);
</script>

<template>
  <div
    class="flex-1 flex flex-col lg:flex-row border-4 border-black mx-10 mb-10 bg-white dark:bg-slate-900 shadow-neo min-h-[700px]"
  >
    <!-- Left Sidebar -->
    <div
      class="w-full lg:w-80 border-b-4 lg:border-b-0 lg:border-r-4 border-black flex flex-col bg-background-light dark:bg-slate-800"
    >
      <!-- Workspace Header -->
      <div class="p-6 border-b-4 border-black">
        <div
          class="flex items-center gap-4 bg-neo-pink border-4 border-black p-3 shadow-neo cursor-pointer hover:-translate-y-1 hover:-translate-x-1 transition-transform"
        >
          <div
            class="size-10 bg-[#f5e1c8] border-2 border-black flex items-center justify-center"
          >
            <div class="w-6 h-4 bg-white border border-black relative">
              <div
                class="absolute -left-1 -top-1 w-2 h-2 bg-green-700 rounded-full"
              ></div>
            </div>
          </div>
          <div class="flex flex-col">
            <span class="font-black uppercase text-black leading-none"
              >Workspace</span
            >
            <span class="text-[10px] font-bold text-black mt-1"
              >Notes & Folders</span
            >
          </div>
        </div>
      </div>

      <!-- Subjects List -->
      <div class="p-6 flex-1 flex flex-col gap-4 overflow-y-auto">
        <h3 class="font-black uppercase tracking-widest text-sm mb-2">
          Subjects
        </h3>

        <div
          v-for="subject in subjects"
          :key="subject.id"
          @click="activateSubject(subject.id)"
          :class="[
            'group flex items-center justify-between p-3 border-4 border-black cursor-pointer transition-transform relative',
            subject.color,
            subject.active
              ? 'shadow-neo translate-x-1 translate-y-1'
              : 'hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
          ]"
        >
          <div class="flex items-center gap-3 w-4/5">
            <span
              class="material-symbols-outlined font-black text-black text-xl"
              >{{ subject.icon }}</span
            >
            <span class="text-black font-black uppercase text-sm truncate">{{
              subject.name
            }}</span>
          </div>

          <button
            @click="deleteFolder(subject.id, $event)"
            class="hidden group-hover:flex items-center justify-center w-8 h-8 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors"
            title="Delete Folder"
          >
            <span class="material-symbols-outlined font-bold text-sm"
              >delete</span
            >
          </button>
        </div>
      </div>

      <!-- New Folder Button -->
      <div class="p-6 pt-0 mt-auto">
        <button
          @click="openAddFolderModal"
          class="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border-4 border-black p-3 font-black uppercase text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo transition-all"
        >
          <span class="material-symbols-outlined font-black"
            >create_new_folder</span
          >
          New Folder
        </button>
      </div>
    </div>

    <!-- Right Main Content Area -->
    <div
      class="flex-1 flex flex-col relative bg-white dark:bg-slate-900"
      v-if="activeSubject"
    >
      <!-- Header / Tabs Area -->
      <div
        class="px-8 pt-8 pb-0 border-b-4 border-black bg-white dark:bg-slate-900 overflow-x-auto"
      >
        <div class="flex items-end gap-2 h-14">
          <template v-for="note in activeSubject.notes" :key="note.id">
            <div
              @click="activateNoteTab(note.id)"
              class="group relative flex items-center justify-between h-full px-4 border-4 border-black border-b-0 rounded-t-lg bg-white dark:bg-slate-800 cursor-pointer transition-all min-w-[140px] max-w-[240px]"
              :class="[
                activeNoteId === note.id
                  ? `z-10 h-14 translate-y-[4px] shadow-none ${activeSubject.color}`
                  : 'h-11 hover:h-12 hover:-translate-y-1 shadow-[2px_0px_0px_0px_rgba(0,0,0,1)]',
              ]"
            >
              <input
                v-if="activeNoteId === note.id"
                v-model="note.title"
                class="flex-1 bg-transparent border-none outline-none focus:ring-0 font-black uppercase text-sm text-black placeholder:text-gray-700 p-0 mr-2"
                placeholder="UNTITLED"
              />
              <span
                v-else
                class="flex-1 font-black uppercase text-sm text-black truncate cursor-pointer mr-2"
                >{{ note.title || "UNTITLED" }}</span
              >

              <button
                @click="deleteNoteTab(note.id, $event)"
                class="opacity-0 group-hover:opacity-100 flex items-center justify-center w-6 h-6 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors flex-shrink-0"
                title="Close Note"
              >
                <span class="material-symbols-outlined font-bold text-sm"
                  >close</span
                >
              </button>
            </div>
          </template>
        </div>
      </div>

      <!-- Toolbar -->
      <div
        class="flex items-center gap-4 p-4 border-b-4 border-black bg-[#ffdeb3] dark:bg-orange-900 overflow-x-auto"
      >
        <div class="flex items-center gap-3 border-r-4 border-black pr-4">
          <button
            @click="boldActive = !boldActive"
            :class="[
              'w-10 h-10 flex items-center justify-center border-4 border-black bg-white shadow-neo hover:translate-y-[2px] hover:translate-x-[2px] transition-all',
              boldActive
                ? 'translate-y-[2px] translate-x-[2px] shadow-none bg-gray-200'
                : '',
            ]"
          >
            <span class="font-black text-xl text-black">B</span>
          </button>
          <button
            @click="italicActive = !italicActive"
            :class="[
              'w-10 h-10 flex items-center justify-center border-4 border-black bg-white shadow-neo hover:translate-y-[2px] hover:translate-x-[2px] transition-all',
              italicActive
                ? 'translate-y-[2px] translate-x-[2px] shadow-none bg-gray-200'
                : '',
            ]"
          >
            <span class="font-black text-xl italic text-black">I</span>
          </button>
          <button
            @click="listActive = !listActive"
            :class="[
              'w-10 h-10 flex items-center justify-center border-4 border-black bg-white shadow-neo hover:translate-y-[2px] hover:translate-x-[2px] transition-all',
              listActive
                ? 'translate-y-[2px] translate-x-[2px] shadow-none bg-gray-200'
                : '',
            ]"
          >
            <span class="material-symbols-outlined font-black text-black"
              >format_list_bulleted</span
            >
          </button>
          <button
            @click="orderedListActive = !orderedListActive"
            :class="[
              'w-10 h-10 flex items-center justify-center border-4 border-black bg-white shadow-neo hover:translate-y-[2px] hover:translate-x-[2px] transition-all',
              orderedListActive
                ? 'translate-y-[2px] translate-x-[2px] shadow-none bg-gray-200'
                : '',
            ]"
          >
            <span class="material-symbols-outlined font-black text-black"
              >format_list_numbered</span
            >
          </button>
        </div>

        <button
          @click="highlightActive = !highlightActive"
          :class="[
            'flex items-center justify-center gap-2 px-4 h-10 border-4 border-black bg-white shadow-neo hover:translate-y-[2px] hover:translate-x-[2px] transition-all',
            highlightActive
              ? 'translate-y-[2px] translate-x-[2px] shadow-none bg-primary'
              : '',
          ]"
        >
          <span class="material-symbols-outlined text-black font-black text-lg"
            >ink_highlighter</span
          >
          <span class="font-black uppercase text-xs text-black">Highlight</span>
        </button>
      </div>

      <!-- Note Editor Area -->
      <div class="flex-1 flex flex-col p-8 overflow-y-auto w-full">
        <textarea
          v-if="activeNote"
          v-model="activeNote.content"
          class="flex-1 w-full max-w-4xl mx-auto resize-none bg-transparent border-none outline-none focus:ring-0 font-bold text-lg leading-relaxed text-black dark:text-white placeholder-gray-400"
          :class="{
            'font-black': boldActive,
            italic: italicActive,
            'bg-[#dcfce7] text-black p-4 border-4 border-black shadow-neo':
              highlightActive,
          }"
          placeholder="Start typing your notes here..."
        ></textarea>
        <div
          v-else
          class="flex-1 flex items-center justify-center font-bold text-gray-400"
        >
          No notes selected.
        </div>
      </div>

      <!-- Floating Action Button -->
      <div class="absolute bottom-8 right-8">
        <button
          @click="addNewNote"
          class="w-16 h-16 bg-[#00ff00] border-4 border-black shadow-neo hover:shadow-neo-hover hover:translate-y-1 hover:translate-x-1 transition-all flex items-center justify-center rounded-xl"
        >
          <span class="material-symbols-outlined font-black text-black text-4xl"
            >add</span
          >
        </button>
      </div>
    </div>

    <!-- Add Folder Modal (Neobrutalism) -->
    <div
      v-if="isAddingFolder"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <div
        class="w-full max-w-md bg-white dark:bg-slate-900 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col transform transition-transform animate-in fade-in zoom-in duration-200"
      >
        <!-- Modal Header -->
        <div
          class="flex items-center justify-between border-b-4 border-black p-4 bg-neo-pink"
        >
          <h3 class="font-black uppercase text-xl text-black">
            Create New Folder
          </h3>
          <button
            @click="cancelAddFolder"
            class="w-8 h-8 flex items-center justify-center bg-white border-2 border-black hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <span class="material-symbols-outlined font-black text-black"
              >close</span
            >
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 flex flex-col gap-6">
          <div class="flex flex-col gap-2">
            <label class="font-bold uppercase text-sm">Folder Name</label>
            <input
              v-model="newFolderName"
              @keyup.enter="confirmAddFolder"
              type="text"
              placeholder="e.g. CHEMISTRY 101"
              class="w-full border-4 border-black p-3 font-bold text-black placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              autofocus
            />
          </div>

          <div class="flex flex-col gap-2">
            <label class="font-bold uppercase text-sm">Select Icon</label>
            <div class="grid grid-cols-6 gap-3">
              <button
                v-for="icon in availableIcons"
                :key="icon"
                @click="newFolderIcon = icon"
                :class="[
                  'w-10 h-10 flex items-center justify-center border-4 border-black bg-white transition-all',
                  newFolderIcon === icon
                    ? 'bg-primary shadow-neo -translate-y-[2px] -translate-x-[2px]'
                    : 'hover:bg-gray-100 hover:-translate-y-[1px] hover:-translate-x-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
                ]"
              >
                <span
                  class="material-symbols-outlined font-black text-black text-xl"
                  >{{ icon }}</span
                >
              </button>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div
          class="p-4 border-t-4 border-black bg-background-light dark:bg-slate-800 flex justify-end gap-4"
        >
          <button
            @click="cancelAddFolder"
            class="px-6 py-2 border-4 border-black bg-white dark:bg-slate-700 font-bold uppercase transition-all hover:-translate-y-[2px] hover:-translate-x-[2px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            Cancel
          </button>
          <button
            @click="confirmAddFolder"
            class="px-6 py-2 border-4 border-black bg-neo-mint text-black font-black uppercase transition-all hover:-translate-y-[2px] hover:-translate-x-[2px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            Create
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal (Neobrutalism) -->
    <div
      v-if="isConfirmingDelete"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <div
        class="w-full max-w-sm bg-white dark:bg-slate-900 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col transform transition-transform animate-in fade-in zoom-in duration-200"
      >
        <!-- Modal Header -->
        <div
          class="flex items-center gap-3 border-b-4 border-black p-4 bg-neo-orange"
        >
          <span class="material-symbols-outlined font-black text-black"
            >warning</span
          >
          <h3 class="font-black uppercase text-xl text-black">
            Confirm Delete
          </h3>
        </div>

        <!-- Modal Body -->
        <div class="p-6">
          <p class="font-bold text-lg text-black dark:text-white leading-snug">
            Are you sure you want to delete this {{ deleteTargetType }}?<br />
            <span
              v-if="deleteTargetType === 'folder'"
              class="text-sm text-red-600 dark:text-red-400"
              >All notes inside will also be deleted.</span
            >
            <span class="text-sm text-gray-600 dark:text-gray-400"
              >This action cannot be undone.</span
            >
          </p>
        </div>

        <!-- Modal Footer -->
        <div
          class="p-4 border-t-4 border-black bg-background-light dark:bg-slate-800 flex justify-end gap-3"
        >
          <button
            @click="cancelDelete"
            class="px-5 py-2 border-4 border-black bg-white dark:bg-slate-700 font-bold uppercase transition-all hover:-translate-y-[2px] hover:-translate-x-[2px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            Cancel
          </button>
          <button
            @click="executeDelete"
            class="px-5 py-2 border-4 border-black bg-neo-pink text-black font-black uppercase transition-all hover:-translate-y-[2px] hover:-translate-x-[2px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

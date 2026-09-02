<template>
  <div class="app-layout">
    <!-- Header: Meets Requirement 2 (Student Name & ID on Frontend UI) -->
    <header class="app-header">
      <div class="header-container">
        <div class="brand-section">
          <div class="brand-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </div>
          <div>
            <h1 class="brand-title">CompuRoom Lab Manager</h1>
            <p class="brand-subtitle">ระบบบันทึกข้อมูลเครื่องคอมพิวเตอร์ประจำห้อง · DevOps 30901-2008</p>
          </div>
        </div>

        <div class="student-badge-header">
          <div class="student-info">
            <div class="student-name">นายพีระพัฒน์ คำแหงพล</div>
            <div class="student-id">รหัส: 68319010010 (ปวส.2 ทส.)</div>
          </div>
          <div class="health-status" :title="'Backend Status: ' + (healthInfo.status || 'Checking...')">
            <span class="health-dot"></span>
            <span>API: {{ healthInfo.status ? 'Online (' + healthInfo.version + ')' : 'Connecting...' }}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <!-- 1. Statistics Cards -->
      <section class="stats-grid">
        <div class="glass-card stat-card stat-total">
          <div class="stat-icon-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          </div>
          <div class="stat-data">
            <span class="stat-label">คอมพิวเตอร์ทั้งหมด</span>
            <span class="stat-value">{{ stats.total }}</span>
          </div>
        </div>

        <div class="glass-card stat-card stat-active">
          <div class="stat-icon-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div class="stat-data">
            <span class="stat-label">พร้อมใช้งาน</span>
            <span class="stat-value">{{ stats.active }}</span>
          </div>
        </div>

        <div class="glass-card stat-card stat-repair">
          <div class="stat-icon-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          </div>
          <div class="stat-data">
            <span class="stat-label">ส่งซ่อม / ปรับปรุง</span>
            <span class="stat-value">{{ stats.repair }}</span>
          </div>
        </div>

        <div class="glass-card stat-card stat-disposed">
          <div class="stat-icon-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
          </div>
          <div class="stat-data">
            <span class="stat-label">จำหน่าย / ปลดระวาง</span>
            <span class="stat-value">{{ stats.disposed }}</span>
          </div>
        </div>
      </section>

      <!-- 2. Action Toolbar & Filter Controls -->
      <section class="glass-card toolbar-section">
        <div class="toolbar-header">
          <h2 class="toolbar-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            รายการครุภัณฑ์คอมพิวเตอร์ ({{ filteredComputers.length }} รายการ)
          </h2>

          <button id="btn-add-computer" class="btn btn-primary" @click="openAddModal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            เพิ่มเครื่องใหม่
          </button>
        </div>

        <div class="toolbar-controls">
          <!-- Search box -->
          <div class="search-input-wrapper">
            <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              id="search-input"
              v-model="searchQuery" 
              type="text" 
              class="form-control" 
              placeholder="ค้นหารหัสครุภัณฑ์, ยี่ห้อ, รุ่น, หรือ CPU..."
            />
          </div>

          <!-- Status filter -->
          <div>
            <select id="filter-status" v-model="statusFilter" class="form-control">
              <option value="ทั้งหมด">สถานะทั้งหมด</option>
              <option value="ใช้งาน">ใช้งาน</option>
              <option value="ส่งซ่อม">ส่งซ่อม</option>
              <option value="จำหน่าย">จำหน่าย</option>
            </select>
          </div>

          <!-- Room filter -->
          <div>
            <select id="filter-room" v-model="roomFilter" class="form-control">
              <option value="ทั้งหมด">ห้องทั้งหมด</option>
              <option v-for="r in availableRooms" :key="r" :value="r">{{ r }}</option>
            </select>
          </div>

          <!-- Refresh button -->
          <button id="btn-refresh" class="btn btn-secondary" @click="fetchComputers" :disabled="isLoading">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            รีเฟรช
          </button>
        </div>
      </section>

      <!-- 3. Data Table (Read, Edit, Delete) -->
      <section class="glass-card table-container">
        <table class="data-table" id="table-computers">
          <thead>
            <tr>
              <th>ID</th>
              <th>รหัสครุภัณฑ์</th>
              <th>ยี่ห้อ / รุ่น</th>
              <th>สเปก (CPU / RAM)</th>
              <th>ห้องที่ติดตั้ง</th>
              <th>สถานะ</th>
              <th style="text-align: right;">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="7" class="empty-state">
                <p>กำลังโหลดข้อมูล...</p>
              </td>
            </tr>
            <tr v-else-if="filteredComputers.length === 0">
              <td colspan="7" class="empty-state">
                <div class="empty-icon">🖥️</div>
                <h3>ไม่พบข้อมูลคอมพิวเตอร์</h3>
                <p style="color: var(--text-muted); font-size: 0.9rem;">ลองเปลี่ยนคำค้นหา หรือกดปุ่ม "เพิ่มเครื่องใหม่" ด้านบน</p>
              </td>
            </tr>
            <tr v-for="item in filteredComputers" :key="item.id" :id="'row-' + item.id">
              <td style="color: var(--text-muted); font-family: monospace;">#{{ item.id }}</td>
              <td>
                <span class="asset-badge">{{ item.asset_code }}</span>
              </td>
              <td style="font-weight: 600;">{{ item.brand_model }}</td>
              <td>
                <div>{{ item.cpu }}</div>
                <div style="font-size: 0.8rem; color: var(--text-secondary);">RAM: {{ item.ram_gb }} GB</div>
              </td>
              <td>
                <span style="font-weight: 500;">{{ item.room }}</span>
              </td>
              <td>
                <span :class="getStatusClass(item.status)">
                  ● {{ item.status }}
                </span>
              </td>
              <td style="text-align: right;">
                <div class="table-actions" style="justify-content: flex-end;">
                  <button 
                    :id="'btn-edit-' + item.id" 
                    class="btn btn-secondary btn-sm" 
                    @click="openEditModal(item)"
                    title="แก้ไขข้อมูล"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    แก้ไข
                  </button>
                  <button 
                    :id="'btn-delete-' + item.id" 
                    class="btn btn-danger btn-sm" 
                    @click="openDeleteConfirm(item)"
                    title="ลบข้อมูล"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    ลบ
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>

    <!-- Modal Form: Add / Edit -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">
            {{ isEditing ? '✏️ แก้ไขข้อมูลเครื่องคอมพิวเตอร์' : '➕ เพิ่มเครื่องคอมพิวเตอร์ใหม่' }}
          </h3>
          <button class="btn-close" @click="closeModal">&times;</button>
        </div>
        <form @submit.prevent="saveComputer">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label" for="form-asset-code">รหัสครุภัณฑ์ / รหัสเครื่อง *</label>
              <input 
                id="form-asset-code" 
                v-model="formData.asset_code" 
                type="text" 
                class="form-control" 
                placeholder="เช่น COM-LAB1-01" 
                required 
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="form-brand-model">ยี่ห้อและรุ่น (Brand & Model) *</label>
              <input 
                id="form-brand-model" 
                v-model="formData.brand_model" 
                type="text" 
                class="form-control" 
                placeholder="เช่น Dell OptiPlex 7090" 
                required 
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="form-cpu">สเปก CPU *</label>
                <input 
                  id="form-cpu" 
                  v-model="formData.cpu" 
                  type="text" 
                  class="form-control" 
                  placeholder="เช่น Intel Core i7-11700" 
                  required 
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="form-ram">RAM (GB) *</label>
                <input 
                  id="form-ram" 
                  v-model.number="formData.ram_gb" 
                  type="number" 
                  min="1" 
                  max="512" 
                  class="form-control" 
                  placeholder="เช่น 16" 
                  required 
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="form-room">ห้องที่ติดตั้ง *</label>
                <input 
                  id="form-room" 
                  v-model="formData.room" 
                  type="text" 
                  class="form-control" 
                  placeholder="เช่น Lab 101" 
                  required 
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="form-status">สถานะการใช้งาน *</label>
                <select id="form-status" v-model="formData.status" class="form-control" required>
                  <option value="ใช้งาน">ใช้งาน</option>
                  <option value="ส่งซ่อม">ส่งซ่อม</option>
                  <option value="จำหน่าย">จำหน่าย</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">ยกเลิก</button>
            <button id="btn-save-submit" type="submit" class="btn btn-primary" :disabled="isSaving">
              {{ isSaving ? 'กำลังบันทึก...' : (isEditing ? 'บันทึกการแก้ไข' : 'บันทึกข้อมูล') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirm Delete Modal -->
    <div v-if="deleteItemTarget" class="modal-overlay" @click.self="deleteItemTarget = null">
      <div class="modal-content" style="max-width: 440px;">
        <div class="modal-header">
          <h3 class="modal-title" style="color: var(--danger);">🗑️ ยืนยันการลบข้อมูล</h3>
          <button class="btn-close" @click="deleteItemTarget = null">&times;</button>
        </div>
        <div class="modal-body">
          <p>คุณแน่ใจหรือไม่ว่าต้องการลบรายการคอมพิวเตอร์:</p>
          <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: var(--radius-md); margin-top: 8px;">
            <div><strong>รหัส:</strong> {{ deleteItemTarget.asset_code }}</div>
            <div><strong>รุ่น:</strong> {{ deleteItemTarget.brand_model }} ({{ deleteItemTarget.room }})</div>
          </div>
          <p style="color: var(--danger); font-size: 0.85rem; margin-top: 8px;">* การกระทำนี้ไม่สามารถย้อนกลับได้</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="deleteItemTarget = null">ยกเลิก</button>
          <button id="btn-confirm-delete" class="btn btn-danger" @click="confirmDelete" :disabled="isSaving">
            {{ isSaving ? 'กำลังลบ...' : 'ยืนยันลบ' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Alerts -->
    <div class="toast-container">
      <div v-for="t in toasts" :key="t.id" :class="['toast', t.type === 'error' ? 'toast-error' : 'toast-success']">
        <span>{{ t.type === 'error' ? '⚠️' : '✅' }}</span>
        <span>{{ t.message }}</span>
      </div>
    </div>

    <!-- Footer: Meets Requirement 2 & Documentation -->
    <footer class="app-footer">
      <div class="footer-content">
        <div>
          <strong>ข้อสอบกลางภาคปฏิบัติ DevOps Mini Project</strong> · แผนกวิชาเทคโนโลยีสารสนเทศ วิทยาลัยเทคนิคเลย
        </div>
        <div class="footer-devops-tags">
          <span class="devops-tag">Node.js Express</span>
          <span class="devops-tag">PostgreSQL</span>
          <span class="devops-tag">Vue 3 + Vite</span>
          <span class="devops-tag">Docker Compose</span>
          <span class="devops-tag">GitHub Actions CI</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';

// Application State
const computers = ref([]);
const isLoading = ref(false);
const isSaving = ref(false);
const healthInfo = reactive({ status: '', version: '' });

// Filters & Search
const searchQuery = ref('');
const statusFilter = ref('ทั้งหมด');
const roomFilter = ref('ทั้งหมด');

// Modal State
const isModalOpen = ref(false);
const isEditing = ref(false);
const currentEditId = ref(null);
const deleteItemTarget = ref(null);

const formData = reactive({
  asset_code: '',
  brand_model: '',
  cpu: '',
  ram_gb: 16,
  room: '',
  status: 'ใช้งาน'
});

// Toast notifications
const toasts = ref([]);
const showToast = (message, type = 'success') => {
  const id = Date.now();
  toasts.value.push({ id, message, type });
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  }, 4000);
};

// API Base URL (relative path works with Vite proxy and Nginx reverse proxy)
const API_BASE = '/api/computers';

// Check Health Endpoint
const checkHealth = async () => {
  try {
    const res = await fetch('/health');
    if (res.ok) {
      const data = await res.json();
      healthInfo.status = data.status;
      healthInfo.version = data.version;
    }
  } catch {
    healthInfo.status = 'offline';
  }
};

// Fetch All Computers
const fetchComputers = async () => {
  isLoading.value = true;
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('ไม่สามารถดึงข้อมูลได้');
    computers.value = await res.json();
  } catch (err) {
    showToast(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล', 'error');
  } finally {
    isLoading.value = false;
  }
};

// Available rooms list for filter dropdown
const availableRooms = computed(() => {
  const rooms = new Set(computers.value.map(c => c.room).filter(Boolean));
  return Array.from(rooms).sort();
});

// Computed Filtered List
const filteredComputers = computed(() => {
  return computers.value.filter(item => {
    const matchStatus = statusFilter.value === 'ทั้งหมด' || item.status === statusFilter.value;
    const matchRoom = roomFilter.value === 'ทั้งหมด' || item.room === roomFilter.value;
    const q = searchQuery.value.trim().toLowerCase();
    const matchSearch = !q || 
      (item.asset_code && item.asset_code.toLowerCase().includes(q)) ||
      (item.brand_model && item.brand_model.toLowerCase().includes(q)) ||
      (item.cpu && item.cpu.toLowerCase().includes(q)) ||
      (item.room && item.room.toLowerCase().includes(q));

    return matchStatus && matchRoom && matchSearch;
  });
});

// Computed Statistics
const stats = computed(() => {
  const total = computers.value.length;
  const active = computers.value.filter(c => c.status === 'ใช้งาน').length;
  const repair = computers.value.filter(c => c.status === 'ส่งซ่อม').length;
  const disposed = computers.value.filter(c => c.status === 'จำหน่าย').length;
  return { total, active, repair, disposed };
});

const getStatusClass = (status) => {
  if (status === 'ใช้งาน') return 'status-pill status-active';
  if (status === 'ส่งซ่อม') return 'status-pill status-repair';
  return 'status-pill status-disposed';
};

// Modal Actions
const openAddModal = () => {
  isEditing.value = false;
  currentEditId.value = null;
  formData.asset_code = '';
  formData.brand_model = '';
  formData.cpu = '';
  formData.ram_gb = 16;
  formData.room = '';
  formData.status = 'ใช้งาน';
  isModalOpen.value = true;
};

const openEditModal = (item) => {
  isEditing.value = true;
  currentEditId.value = item.id;
  formData.asset_code = item.asset_code;
  formData.brand_model = item.brand_model;
  formData.cpu = item.cpu;
  formData.ram_gb = item.ram_gb;
  formData.room = item.room;
  formData.status = item.status;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

// Save (Create or Update)
const saveComputer = async () => {
  isSaving.value = true;
  try {
    const url = isEditing.value ? `${API_BASE}/${currentEditId.value}` : API_BASE;
    const method = isEditing.value ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }

    showToast(isEditing.value ? 'แก้ไขข้อมูลสำเร็จ!' : 'เพิ่มข้อมูลเครื่องใหม่เรียบร้อยแล้ว!');
    closeModal();
    await fetchComputers();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    isSaving.value = false;
  }
};

// Delete Action
const openDeleteConfirm = (item) => {
  deleteItemTarget.value = item;
};

const confirmDelete = async () => {
  if (!deleteItemTarget.value) return;
  isSaving.value = true;
  try {
    const res = await fetch(`${API_BASE}/${deleteItemTarget.value.id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'ไม่สามารถลบข้อมูลได้');

    showToast(`ลบรายการ ${deleteItemTarget.value.asset_code} เรียบร้อยแล้ว`);
    deleteItemTarget.value = null;
    await fetchComputers();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  checkHealth();
  fetchComputers();
});
</script>

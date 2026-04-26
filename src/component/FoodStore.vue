<template>
    <!-- data table at add/edit modal -->
    <v-app>
        <v-main>
            <v-container class="pa-4">
                <h2>Food Store</h2>

                <!-- food items table -->
                <v-card>
                    <!-- Loading indicator habang nag-load ang data... matuto maghintay -->
                    <v-progress-linear v-if="isLoading" indeterminate></v-progress-linear>
                    <v-data-table :items="counterStore.items" :headers="headers" class="elevation-1"
                        :disabled="isLoading">
                        <template #item.image="{ item }">
                            <v-avatar size="48">
                                <img :src="item.image" alt="Image preview" />
                            </v-avatar>
                        </template>

                        <template #item.price="{ item }">
                            {{ formatCurrency(item.price) }}
                        </template>

                        <template #item.actions="{ item }">
                            <div class="actions-container">
                                <v-tooltip text="I-edit ang item">
                                    <template #activator="{ props }">
                                        <v-btn icon size="small" color="primary" @click="editItem(item)" v-bind="props">
                                            <v-icon size="x-small">mdi-pencil</v-icon>
                                        </v-btn>
                                    </template>
                                </v-tooltip>
                                <v-tooltip text="I-delete ang item">
                                    <template #activator="{ props }">
                                        <v-btn icon size="small" color="error" @click="deleteItem(item.id)"
                                            v-bind="props">
                                            <v-icon size="x-small">mdi-delete</v-icon>
                                        </v-btn>
                                    </template>
                                </v-tooltip>
                            </div>
                        </template>
                    </v-data-table>
                </v-card>
            </v-container>
            <!-- Floating Button para sa add/edit modal... floating parang brain nimo -->
            <v-fab icon="mdi-plus" app appear @click="openDialog" class="fab-btn" :disabled="isLoading"></v-fab>

            <!-- Modal dialog for edit ng food items -->
            <v-dialog v-model="showDialog" max-width="600" persistent>
                <v-card class="dialog-card">
                    <v-card-title class="sticky-header d-flex justify-space-between align-center">
                        <p class="text-black">Place your order.</p>
                        <v-btn icon @click="closeDialog" class="ml-auto">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-card-title>
                 
                        <v-progress-linear v-if="isLoading" indeterminate></v-progress-linear>
                    <v-form ref="formRef" @submit.prevent="saveItem" class="pa-4 form-container">
                        <v-row>
                            <v-col cols="12">
                                <v-text-field label="ID" v-model="form.id" readonly />
                            </v-col>
                            <v-col cols="12">
                                <v-text-field label="Name" v-model="form.name" :rules="[requiredRule]" />
                            </v-col>
                            <v-col cols="12">
                                <v-text-field label="Image URL" v-model="form.image" :rules="[requiredRule, urlRule]"
                                    type="url" />
                            </v-col>
                            <v-col cols="12">
                                <v-text-field label="Description" v-model="form.description" :rules="[requiredRule]"
                                    multiline />
                            </v-col>
                            <v-col cols="12">
                                <v-text-field label="Benefits" v-model="form.benefits" :rules="[requiredRule]"
                                    multiline />
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field label="Variant" v-model="form.variant" :rules="[requiredRule]" />
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field label="Kind" v-model="form.kind" :rules="[requiredRule]" />
                            </v-col>
                            <v-col cols="12">
                                <v-text-field label="Remarks" v-model="form.remarks" multiline />
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field label="Price" v-model="form.price" type="number"
                                    :rules="[requiredRule, numberRule]" min="0" />
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field label="Quantity" v-model="form.quantity" type="number"
                                    :rules="[requiredRule, numberRule]" min="0" />
                            </v-col>
                        </v-row>

                        <v-row class="mt-4" align="center" justify="space-between">
                            <v-btn color="secondary" text @click="resetForm" :disabled="isLoading">Clear</v-btn>
                            <v-btn color="primary" type="submit" class="ml-2" :disabled="isLoading"
                                :loading="isLoading">
                                {{ isEditing ? 'Update Item' : 'Add Item' }}
                            </v-btn>
                        </v-row>
                    </v-form>
                  
                </v-card>
            </v-dialog>
        </v-main>
    </v-app>
</template>

<script setup>
import { ref, watch} from 'vue'
import { useCounterStore } from '@/stores/counter'

// #region Initialization
// Pinia global manipulation store para sa food items at auto-incrementing ID
const counterStore = useCounterStore()
// #endregion

// #region State Management
// Reference sa form para sa validation
const formRef = ref(null)
// para sa pag-track kung ang form ay nasa edit mode o add mode
const isEditing = ref(false)
// para sa visibility ng modal dialog
const showDialog = ref(false)
// Loading state para sa async operations
const isLoading = ref(false)
// #endregion

// #region Form Data
// Reactive form object na naglalaman ng food item data
const form = ref({
    id: counterStore.nextId,
    name: '',
    image: '',
    description: '',
    benefits: '',
    variant: '',
    kind: '',
    price: null,
    quantity: null,
    remarks: '',
})
// #endregion

watch( // watcher para i track and next id na papasok sa form 24/7 yarn
    () => counterStore.nextId,
    (newId) => {
        if (!isEditing.value) {
            form.value.id = newId
        }
    }
)

// #region Table Configuration
// data table
const headers = [
    { title: 'ID', value: 'id' },
    { title: 'Name', value: 'name' },
    { title: 'Image', value: 'image' },
    { title: 'Description', value: 'description' },
    { title: 'Benefits', value: 'benefits' },
    { title: 'Variant', value: 'variant' },
    { title: 'Kind', value: 'kind' },
    { title: 'Price', value: 'price' },
    { title: 'Quantity', value: 'quantity' },
    { title: 'Remarks', value: 'remarks' },
    { title: 'Actions', value: 'actions', sortable: false },
]
// #endregion

// #region Validation Rules
// Validation rules para sa form fields
const requiredRule = (value) => !!value || 'This field is required.'
const urlRule = (value) => {
    if (!value) return 'This field is required.'
    // Tukuyin kung valid na URL format
    const valid = /^https?:\/\/.+/.test(value)
    return valid || 'Enter a valid URL.'
}
const numberRule = (value) => {
    if (value === null || value === undefined || value === '') return 'This field is required.'
    // Tukuyin kung valid na numero
    return !Number.isNaN(Number(value)) || 'Enter a valid number.'
}
// #endregion

// #region Dialog Functions
// open modal
const openDialog = async () => {
    try {
        isLoading.value = true
        await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate data loading
        showDialog.value = true
    } catch (error) {
        alert(`Error opening dialog: ${error.message}`)
    } finally {
        isLoading.value = false
    }
}

// close modal
const closeDialog = async () => { //try catch kase naka async await na may loading state, para mahandle yung potential errors at maayos ang user experience nakanang
    try {
        isLoading.value = true
        showDialog.value = false
        resetForm()
    } catch (error) {
        alert(`⚠️ Error closing dialog: ${error.message}`)
    } finally {
        isLoading.value = false
    }
}
// #endregion

// #region Form Management
const resetForm = () => {
    try {
        form.value = {
            id: counterStore.nextId,
            name: '',
            image: '',
            description: '',
            benefits: '',
            variant: '',
            kind: '',
            price: null,
            quantity: null,
            remarks: '',
        }
        isEditing.value = false
        formRef.value?.resetValidation?.()
    } catch (error) {
        alert(`Error resetting form: ${error.message}`)
    }
}
// #endregion

// #region Save Operations
const saveItem = async () => {
    try {
        isLoading.value = true

        // Tukuyin kung lahat ng validation ay lumampas
        const valid = await formRef.value?.validate?.()
        if (valid === false) {
            alert('Mangyaring lamang na kumpletuhin ang lahat ng required fields.\n wag makulit!')
            isLoading.value = false
            return
        }
        // Simulate processing delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        const payload = {
            ...form.value,
            price: Number(form.value.price),
            quantity: Number(form.value.quantity),
        }

        if (isEditing.value) {
            counterStore.updateItem(payload)
            alert('Item successfully updated!')
        } else {
            counterStore.addItem(payload)
            alert('Item successfully added!')
        }

        await closeDialog()
    } catch (error) {
        alert(`Error saving item: ${error.message}`)
    } finally {
        isLoading.value = false
    }
}
// #endregion

// #region Edit Operations
const editItem = async (item) => {
    try {
        isLoading.value = true

        if (!item || !item.id) {
            alert('Invalid item selected.')
            isLoading.value = false
            return
        }

        //data loading
        await new Promise((resolve) => setTimeout(resolve, 300))

        form.value = { ...item }
        isEditing.value = true
        showDialog.value = true
    } catch (error) {
        alert(`Error loading item: ${error.message}`)
    } finally {
        isLoading.value = false
    }
}
// #endregion

// #region Delete Operations
const deleteItem = async (id) => {
    try {
        isLoading.value = true

        if (!id) {
            alert('Invalid item ID ngani.')
            isLoading.value = false
            return
        }

        
        const confirmed = confirm('Sigurado ka na bang gusto mong i-delete ang item na ito?')
        if (!confirmed) {
            isLoading.value = false
            return
        }

        //deletion delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        counterStore.deleteItem(id)
        alert('Item successfully deleted!')

        if (!isEditing.value) {
            form.value.id = counterStore.nextId
        }


    } catch (error) {
        alert(`Error deleting item: ${error.message}`)
    } finally {
        isLoading.value = false
    }
}
// #endregion

// #region Utilities
// USD formatter gamit ang Intl API
const formatCurrency = (value) => {
    try {
        if (value === null || value === undefined || value === '') return ''
        const numValue = Number(value)
        if (Number.isNaN(numValue)) {
            throw new Error('Invalid number value')
        }
        return new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 2,
        }).format(numValue)
    } catch (error) {
        console.error(`Error formatting currency: ${error.message}`)
        return ''
    }
}
// #endregion
</script>
<style scoped>

h2 {
    margin-bottom: 1rem;
}


.dialog-card {
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    max-height: 90vh;
}


.sticky-header {
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 10;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 12px 12px 0 0;
    flex-shrink: 0;
}


.form-container {
    overflow-y: auto;
    flex: 1;
}


.actions-container {
    display: flex;
    gap: 4px;
    align-items: center;
}
</style>
import { computed, onMounted, ref, toRefs } from 'vue'
import { Code } from '@/models/Code'
import { SlipStatusLabel } from '@/util/constants'
import { useCodes } from '../useCodes'

export function useStatusMenu (props, emits) {
  const { getRoutingSlipStatusList, routingSlipStatusList } = useCodes()
  // default value set blank incase if we didnt pass props
  const { modalValue = ref(''), allowedStatusList = ref([]) } = toRefs(props)

  // using same v-model value for getting value and update parent on change
  const currentStatus = computed({
    get: () => {
      return modalValue.value || ''
    },
    set: (modalValue: Code) => {
      emits('input', modalValue.code)
    }
  })

  // state , action , mutation from vuex store
  const routingAllowedSlipStatus = computed(() => {
    return getFormattedStatusList()
  })
  const routingSlipStatus = computed(() => {
    return routingSlipStatusList.value
  })

  onMounted(() => {
    // getting status list mount and setting inside store
    // will make call once till page refresh
    getRoutingSlipStatusList()
  })

  function getFormattedStatusList () {
    let filterStatus = []

    filterStatus = allowedStatusList.value.map((status) => {
      const statusList: any = {}
      statusList.label = SlipStatusLabel[status] || ''
      statusList.code = status
      return statusList
    }).filter((status) => status.label !== '')

    return filterStatus
  }

  /**
   * return status label on code
   *
   * @param {string} code
   * @returns {string} description - label
   */
  function statusLabel (code: string) {
    const codeArray = getSelectedStatusObject(code)
    return codeArray[0]?.description || ''
  }

  /**
   * filtering array and find given value of object
   * use full when needed to set object of status
   * @param {string} code
   * @returns [{code, description}]
   */

  function getSelectedStatusObject (code: string) {
    return routingSlipStatus.value?.filter(
      (statusList) => statusList.code === code
    )
  }

  function setStatus (status) {
    emits('update:statusChange', status)
  }
  return {
    routingSlipStatus,
    routingAllowedSlipStatus,
    currentStatus,
    statusLabel,
    getSelectedStatusObject,
    allowedStatusList,
    setStatus
  }
}


import { useSubscription } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { computed, watch } from 'vue'
import { useSubscriptionIndicator } from '~/composables/useSubscriptionIndicator'

const ENTITY_CHANGE_SUBSCRIPTION   = gql`
subscription EntityUpdatedSubscription($uuid: UUID!) {
  entityUpdated(uuid: $uuid) {
    __typename
    before
    after
    source
  }
}
`

export function useEntityChangeSubscription(uuid: string) {
  const variables = { uuid }
  console.log('Variables:', variables)
  const { result, error } = useSubscription(ENTITY_CHANGE_SUBSCRIPTION, variables)
  console.log('Result:', result.value)
  console.log('Error:', error.value)
  const entity = computed(() => result.value?.entityUpdated || null)

  // Flash indicator on new subscription event
  const { triggerFlash } = useSubscriptionIndicator()
  watch(result, (newVal, oldVal) => {
    if (newVal && newVal.entityUpdated && newVal !== oldVal) {
      console.log('Entity updated:', newVal)
      triggerFlash()
    }
  })

  return { entity, error }
}

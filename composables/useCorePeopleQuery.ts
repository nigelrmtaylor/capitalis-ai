
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { computed } from 'vue'

const CORE_PEOPLE_QUERY = gql`
  query MyQuery {
    allCorePeople {
      nodes {
        personId
        name
      }
    }
  }
`

export function useCorePeopleQuery() {
  const { result, loading, error } = useQuery(CORE_PEOPLE_QUERY)
  const people = computed(() => result.value?.allCorePeople?.nodes || [])
  return { people, loading, error }
}

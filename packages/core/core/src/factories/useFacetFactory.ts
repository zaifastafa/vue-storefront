import { Ref, computed } from '@vue/composition-api';
import { vsfRef, Logger } from '../utils';
import { UseFacet, FacetSearchResult, AgnosticFacetSearchParams } from '../types';
import { useContext, Context } from './../utils';

interface UseFacetFactoryParams<SEARCH_DATA> {
  search: (context: Context, params?: FacetSearchResult<SEARCH_DATA>) => Promise<SEARCH_DATA>;
}

const useFacetFactory = <SEARCH_DATA>(factoryParams: UseFacetFactoryParams<SEARCH_DATA>) => {

  const useFacet = (id?: string): UseFacet<SEARCH_DATA> => {
    const ssrKey = id || 'useFacet';
    const loading: Ref<boolean> = vsfRef(false, `${ssrKey}-loading`);
    const result: Ref<FacetSearchResult<SEARCH_DATA>> = vsfRef({ data: null, input: null }, `${ssrKey}-facets`);
    const context = useContext();

    const search = async (params?: AgnosticFacetSearchParams) => {
      Logger.debug('useFacet.search', params);

      result.value.input = params;
      loading.value = true;
      result.value.data = await factoryParams.search(context, result.value);
      loading.value = false;
    };

    return {
      result: computed(() => result.value),
      loading: computed(() => loading.value),
      search
    };
  };

  return useFacet;
};

export { useFacetFactory };

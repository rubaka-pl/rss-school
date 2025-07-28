import { store } from '../store/store';
import { toggleItem, clearSelection } from '../features/selectedItemsSlice';

describe('Redux store', () => {
  it('should initialize with correct default state', () => {
    const state = store.getState().selectedItems;
    expect(state.items).toEqual({});
  });

  it('should add item when toggleItem is dispatched', () => {
    store.dispatch(
      toggleItem({
        id: 'pikachu',
        name: 'Pikachu',
        description: 'Electric type Pokémon.',
        detailsUrl: 'https://pokeapi.co/api/v2/pokemon/pikachu',
      })
    );
    const state = store.getState().selectedItems;
    expect(state.items.pikachu).toEqual({
      id: 'pikachu',
      name: 'Pikachu',
      description: 'Electric type Pokémon.',
      detailsUrl: 'https://pokeapi.co/api/v2/pokemon/pikachu',
    });
  });

  it('should remove item when toggleItem is dispatched again', () => {
    store.dispatch(
      toggleItem({
        id: 'pikachu',
        name: 'Pikachu',
        description: 'Electric type Pokémon.',
        detailsUrl: 'https://pokeapi.co/api/v2/pokemon/pikachu',
      })
    );
    const state = store.getState().selectedItems;
    expect(state.items).not.toHaveProperty('pikachu');
  });

  it('should clear all items with clearSelection', () => {
    store.dispatch(
      toggleItem({ id: 'a', name: 'A', description: '', detailsUrl: '' })
    );
    store.dispatch(
      toggleItem({ id: 'b', name: 'B', description: '', detailsUrl: '' })
    );
    let state = store.getState().selectedItems;
    expect(Object.keys(state.items)).toHaveLength(2);

    store.dispatch(clearSelection());
    state = store.getState().selectedItems;
    expect(state.items).toEqual({});
  });
});

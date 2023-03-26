import { insert, relocate, rename } from './actions'
import { ContractState, ContractAction, ContractResult } from './types'

export function handle(state: ContractState, action: ContractAction): ContractResult {
    const input = action.input

    switch (input.function) {
        case 'insert': return insert(state, input)
        case 'relocate': return relocate(state, input)
        case 'rename': return rename(state, input)
        case 'evolve': return evolve(state, input)
    }

    throw new ContractError('invalid function')
}
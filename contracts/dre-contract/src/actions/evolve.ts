import { ContractState, ContractInput, ContractResult } from '../types'

export default function evolve(state: ContractState, input: ContractInput): ContractResult {
    if (!input.value) throw new ContractError('invalid arguments')

    const caller = SmartContract.transaction.owner

    if (caller != state.owner) throw new ContractError('only the owner can evolve')

    if (!state.canEvolve) throw new ContractError('cannot evolve contract')

    state.evolve = input.value

    return { state }
}
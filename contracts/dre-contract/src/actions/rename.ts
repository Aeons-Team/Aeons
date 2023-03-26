import { ContractState, ContractInput, ContractResult } from '../types'

export default function rename(state: ContractState, input: ContractInput): ContractResult {
    if (!input.id) throw new ContractError('invalid arguments')

    const caller = SmartWeave.transaction.owner

    const files = state.hierarchy.files[caller]
    
    if (!files) throw new ContractError('drive does not exist')

    const file = files[input.id]

    file.name = input.newName

    return { state }
}
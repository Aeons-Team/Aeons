import { ContractState, ContractInput, ContractResult } from '../types'

export default function relocate(state: ContractState, input: ContractInput): ContractResult {
    if (!input.ids) throw new ContractError('invalid arguments')

    const caller = SmartWeave.transaction.owner

    const files = state.hierarchy.files[caller]
    
    if (!files) throw new ContractError('drive does not exist')

    const oldParent = files[input.oldParentId] ?? caller
    const newParent = files[input.newParentId] ?? caller 

    if (oldParent.contentType != 'folder' || newParent.contentType != 'folder') throw new ContractError('invalid arguments')

    const contains: { [id: string]: boolean } = {}
    const parentContains: { [id: string]: boolean } = {}

    for (const id of oldParent.children) parentContains[id] = true

    if (input.ids.filter(id => !parentContains[id]).length) throw new ContractError('invalid arguments')
    
    for (const id of input.ids) contains[id] = true

    newParent.children.push(...input.ids)
    oldParent.children = oldParent.children.filter(childId => !contains[childId])

    return { state }
}
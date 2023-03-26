import { ContractState, ContractInput, ContractResult } from '../types'

export default function insert(state: ContractState, input: ContractInput): ContractResult {
    if (!input.contentType) throw new ContractError('invalid arguments')

    const caller = SmartWeave.transaction.owner
    
    if (!state.hierarchy.files[caller]) state.hierarchy.files[caller] = {
        [caller]: {
            id: caller,
            name: caller,
            contentType: 'folder',
            children: []
        }
    }

    if (!input.id) input.id = SmartWeave.transaction.id
    if (!input.parentId) input.parentId = caller

    var files = state.hierarchy.files[caller]

    if (files[input.id]) throw new ContractError('file already exists')    

    files[input.id] = {
        id: input.id,
        parentId: input.parentId,
        contentType: input.contentType,
        children: [],
        name: input.name,
        size: input.size
    }

    const parent = files[input.parentId] 

    if (!parent) throw new ContractError('file parent does not exist')

    if (parent.contentType != 'folder') throw new ContractError('parent is not a folder')

    parent.children.push(input.id)

    return { state }
}
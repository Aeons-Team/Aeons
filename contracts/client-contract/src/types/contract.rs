use crate::types::file_hierarchy::FileHierarchy;
use serde::{ Serialize, Deserialize };
use warp_contracts::js_imports::SmartWeave;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Insert {
    pub id: Option<String>,
    pub name: String,
    pub parent_id: Option<String>,
    pub content_type: String,
    pub size: Option<u64>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Relocate {
    pub ids: Vec<String>,
    pub old_parent_id: Option<String>,
    pub new_parent_id: Option<String>
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Rename {
    pub id: String,
    pub new_name: String
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Evolve {
    pub value: String
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SetInternalOwner {
    pub value: String
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase", tag = "function")]
pub enum ContractAction {
    Insert(Insert),
    Relocate(Relocate),
    Rename(Rename),
    Evolve(Evolve),
    SetInternalOwner(SetInternalOwner)
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ContractState {
    pub hierarchy: FileHierarchy,
    pub can_evolve: bool,
    pub evolve: Option<String>,
    pub owner: String,
    pub internal_owner: Option<String>
}

impl ContractState {
    pub fn is_owner(&self) -> bool {
        true
        // self.internal_owner.as_ref().unwrap_or(&self.owner).eq(&SmartWeave::caller())
    }
}
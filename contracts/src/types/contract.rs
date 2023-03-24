use crate::types::file_hierarchy::FileHierarchy;
use serde::{ Serialize, Deserialize };

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Insert {
    pub id: String,
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
pub enum ContractFunction {
    Insert(Insert),
    Relocate(Relocate),
    Rename(Rename)
}

#[derive(Debug, Deserialize)]
pub struct ContractAction {
    pub function: ContractFunction
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ContractState {
    pub hierarchy: FileHierarchy
}
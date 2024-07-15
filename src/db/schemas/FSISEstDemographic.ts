import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class FSISEstDemographic extends Document {
  @Prop({ type: String })
  establishment_number: string;

  @Prop({ type: Number })
  establishment_id: number;

  @Prop({ type: String })
  establishment_name: string;

  @Prop({ type: String })
  active_meat_grant: string;

  @Prop({ type: String })
  last_meat_grant_edit_date: string;

  @Prop({ type: String })
  active_voluntary_grant: string;

  @Prop({ type: String })
  last_voluntary_grant_edit_date: string;

  @Prop({ type: String })
  active_poultry_grant: string;

  @Prop({ type: String })
  last_poultry_grant_edit_date: string;

  @Prop({ type: String })
  active_egg_grant: string;

  @Prop({ type: String })
  last_egg_grant_edit_date: string;

  @Prop({ type: String })
  meat_harvest_cell_cultured: string;

  @Prop({ type: String })
  meat_further_process_cell_cultured: string;

  @Prop({ type: String })
  poultry_harvest_cell_cultured: string;

  @Prop({ type: String })
  poultry_further_process_cell_cultured: string;

  @Prop({ type: String })
  inspection_system_head_attached: string;

  @Prop({ type: String })
  inspection_system_head_detached: string;

  @Prop({ type: String })
  inspection_system_nels: string;

  @Prop({ type: String })
  inspection_system_not_specified: string;

  @Prop({ type: String })
  inspection_system_nti1: string;

  @Prop({ type: String })
  inspection_system_nti1_modified: string;

  @Prop({ type: String })
  inspection_system_nti2: string;

  @Prop({ type: String })
  inspection_system_nti2_modified: string;

  @Prop({ type: String })
  inspection_system_sis: string;

  @Prop({ type: String })
  inspection_system_traditional: string;

  @Prop({ type: String })
  inspection_system_viscera_table_tongue_in: string;

  @Prop({ type: String })
  inspection_system_viscera_table_tongue_out: string;

  @Prop({ type: String })
  inspection_system_viscera_truck: string;

  @Prop({ type: String })
  inspection_system_npis: string;

  @Prop({ type: String })
  inspection_system_npis_waiver: string;

  @Prop({ type: String })
  inspection_system_nsis: string;

  @Prop({ type: String })
  meat_exemption_custom_processing: string;

  @Prop({ type: String })
  meat_exemption_custom_slaughter: string;

  @Prop({ type: String })
  meat_exemption_retail: string;

  @Prop({ type: String })
  meat_exemption_religious: string;

  @Prop({ type: String })
  meat_exemption_religious_halal: string;

  @Prop({ type: String })
  meat_exemption_religious_kosher: string;

  @Prop({ type: String })
  meat_exemption_religious_other: string;

  @Prop({ type: String })
  poultry_exemption_custom_processing: string;

  @Prop({ type: String })
  poultry_exemption_custom_slaughter: string;

  @Prop({ type: String })
  poultry_exemption_retail: string;

  @Prop({ type: String })
  poultry_exemption_religious: string;

  @Prop({ type: String })
  poultry_exemption_religious_buddhist: string;

  @Prop({ type: String })
  poultry_exemption_religious_confucian: string;

  @Prop({ type: String })
  poultry_exemption_religious_islamic: string;

  @Prop({ type: String })
  poultry_exemption_religious_kosher: string;

  @Prop({ type: String })
  slaughter: string;

  @Prop({ type: String })
  processing: string;

  @Prop({ type: String })
  meat_slaughter: string;

  @Prop({ type: String })
  beef_cow_slaughter: string;

  @Prop({ type: String })
  steer_slaughter: string;

  @Prop({ type: String })
  heifer_slaughter: string;

  @Prop({ type: String })
  bull_stag_slaughter: string;

  @Prop({ type: String })
  dairy_cow_slaughter: string;

  @Prop({ type: String })
  heavy_calf_slaughter: string;

  @Prop({ type: String })
  bob_veal_slaughter: string;

  @Prop({ type: String })
  formula_fed_veal_slaughter: string;

  @Prop({ type: String })
  non_formula_fed_veal_slaughter: string;

  @Prop({ type: String })
  market_swine_slaughter: string;

  @Prop({ type: String })
  sow_slaughter: string;

  @Prop({ type: String })
  roaster_swine_slaughter: string;

  @Prop({ type: String })
  boar_stag_swine_slaughter: string;

  @Prop({ type: String })
  stag_swine_slaughter: string;

  @Prop({ type: String })
  feral_swine_slaughter: string;

  @Prop({ type: String })
  goat_slaughter: string;

  @Prop({ type: String })
  young_goat_slaughter: string;

  @Prop({ type: String })
  adult_goat_slaughter: string;

  @Prop({ type: String })
  sheep_slaughter: string;

  @Prop({ type: String })
  lamb_slaughter: string;

  @Prop({ type: String })
  deer_reindeer_slaughter: string;

  @Prop({ type: String })
  antelope_slaughter: string;

  @Prop({ type: String })
  elk_slaughter: string;

  @Prop({ type: String })
  bison_slaughter: string;

  @Prop({ type: String })
  buffalo_slaughter: string;

  @Prop({ type: String })
  water_buffalo_slaughter: string;

  @Prop({ type: String })
  cattalo_slaughter: string;

  @Prop({ type: String })
  yak_slaughter: string;

  @Prop({ type: String })
  other_voluntary_livestock_slaughter: string;

  @Prop({ type: String })
  rabbit_slaughter: string;

  @Prop({ type: String })
  poultry_slaughter: string;

  @Prop({ type: String })
  young_chicken_slaughter: string;

  @Prop({ type: String })
  light_fowl_slaughter: string;

  @Prop({ type: String })
  heavy_fowl_slaughter: string;

  @Prop({ type: String })
  capon_slaughter: string;

  @Prop({ type: String })
  young_turkey_slaughter: string;

  @Prop({ type: String })
  young_breeder_turkey_slaughter: string;

  @Prop({ type: String })
  old_breeder_turkey_slaughter: string;

  @Prop({ type: String })
  fryer_roaster_turkey_slaughter: string;

  @Prop({ type: String })
  duck_slaughter: string;

  @Prop({ type: String })
  goose_slaughter: string;

  @Prop({ type: String })
  pheasant_slaughter: string;

  @Prop({ type: String })
  quail_slaughter: string;

  @Prop({ type: String })
  guinea_slaughter: string;

  @Prop({ type: String })
  ostrich_slaughter: string;

  @Prop({ type: String })
  emu_slaughter: string;

  @Prop({ type: String })
  rhea_slaughter: string;

  @Prop({ type: String })
  squab_slaughter: string;

  @Prop({ type: String })
  other_voluntary_poultry_slaughter: string;

  @Prop({ type: String })
  rte_processing: string;

  @Prop({ type: String })
  nrte_processing: string;

  @Prop({ type: String })
  raw_intact_processing: string;

  @Prop({ type: String })
  raw_non_intact_processing: string;

  @Prop({ type: String })
  meat_processing: string;

  @Prop({ type: String })
  rte_meat_processing: string;

  @Prop({ type: String })
  nrte_meat_processing: string;

  @Prop({ type: String })
  raw_intact_meat_processing: string;

  @Prop({ type: String })
  raw_non_intact_meat_processing: string;

  @Prop({ type: String })
  poultry_processing: string;

  @Prop({ type: String })
  rte_poultry_processing: string;

  @Prop({ type: String })
  nrte_poultry_processing: string;

  @Prop({ type: String })
  raw_intact_poultry_processing: string;

  @Prop({ type: String })
  raw_non_intact_poultry_processing: string;

  @Prop({ type: String })
  egg_processing: string;

  @Prop({ type: String })
  rte_egg_processing: string;

  @Prop({ type: String })
  raw_non_intact_egg_processing: string;

  @Prop({ type: String })
  siluriformes_processing: string;

  @Prop({ type: String })
  rte_siluriformes_processing: string;

  @Prop({ type: String })
  nrte_siluriformes_processing: string;

  @Prop({ type: String })
  raw_intact_siluriformes_processing: string;

  @Prop({ type: String })
  raw_non_intact_siluriformes_processing: string;

  @Prop({ type: String })
  unspecified_processing: string;

  @Prop({ type: String })
  rte_unspecified_processing: string;

  @Prop({ type: String })
  nrte_unspecified_processing: string;

  @Prop({ type: String })
  raw_intact_unspecified_processing: string;

  @Prop({ type: String })
  raw_non_intact_unspecified_processing: string;

  @Prop({ type: String })
  slaughter_or_processing_only: string;

  @Prop({ type: String })
  slaughter_only_class: string;

  @Prop({ type: String })
  slaughter_only_species: string;

  @Prop({ type: String })
  meat_slaughter_only_species: string;

  @Prop({ type: String })
  poultry_slaughter_only_species: string;

  @Prop({ type: String })
  processing_only_category: string;

  @Prop({ type: String })
  processing_only_class: string;

  @Prop({ type: String })
  processing_only_species: string;

  @Prop({ type: String })
  meat_processing_only_species: string;

  @Prop({ type: String })
  poultry_processing_only_species: string;

  @Prop({ type: String })
  beef_processing: string;

  @Prop({ type: String })
  pork_processing: string;

  @Prop({ type: String })
  antelope_processing: string;

  @Prop({ type: String })
  bison_processing: string;

  @Prop({ type: String })
  buffalo_processing: string;

  @Prop({ type: String })
  deer_processing: string;

  @Prop({ type: String })
  elk_processing: string;

  @Prop({ type: String })
  goat_processing: string;

  @Prop({ type: String })
  other_voluntary_livestock_processing: string;

  @Prop({ type: String })
  rabbit_processing: string;

  @Prop({ type: String })
  reindeer_processing: string;

  @Prop({ type: String })
  sheep_processing: string;

  @Prop({ type: String })
  yak_processing: string;

  @Prop({ type: String })
  unspecified_meat_processing: string;

  @Prop({ type: String })
  rte_beef_processing: string;

  @Prop({ type: String })
  rte_pork_processing: string;

  @Prop({ type: String })
  rte_antelope_processing: string;

  @Prop({ type: String })
  rte_bison_processing: string;

  @Prop({ type: String })
  rte_buffalo_processing: string;

  @Prop({ type: String })
  rte_deer_processing: string;

  @Prop({ type: String })
  rte_elk_processing: string;

  @Prop({ type: String })
  rte_goat_processing: string;

  @Prop({ type: String })
  rte_other_voluntary_livestock_processing: string;

  @Prop({ type: String })
  rte_rabbit_processing: string;

  @Prop({ type: String })
  rte_reindeer_processing: string;

  @Prop({ type: String })
  rte_sheep_processing: string;

  @Prop({ type: String })
  rte_yak_processing: string;

  @Prop({ type: String })
  rte_unspecified_meat_processing: string;

  @Prop({ type: String })
  nrte_beef_processing: string;

  @Prop({ type: String })
  nrte_pork_processing: string;

  @Prop({ type: String })
  nrte_antelope_processing: string;

  @Prop({ type: String })
  nrte_bison_processing: string;

  @Prop({ type: String })
  nrte_buffalo_processing: string;

  @Prop({ type: String })
  nrte_deer_processing: string;

  @Prop({ type: String })
  nrte_elk_processing: string;

  @Prop({ type: String })
  nrte_goat_processing: string;

  @Prop({ type: String })
  nrte_other_voluntary_livestock_processing: string;

  @Prop({ type: String })
  nrte_rabbit_processing: string;

  @Prop({ type: String })
  nrte_reindeer_processing: string;

  @Prop({ type: String })
  nrte_sheep_processing: string;

  @Prop({ type: String })
  nrte_yak_processing: string;

  @Prop({ type: String })
  nrte_unspecified_meat_processing: string;

  @Prop({ type: String })
  raw_intact_beef_processing: string;

  @Prop({ type: String })
  raw_intact_pork_processing: string;

  @Prop({ type: String })
  raw_intact_antelope_processing: string;

  @Prop({ type: String })
  raw_intact_bison_processing: string;

  @Prop({ type: String })
  raw_intact_buffalo_processing: string;

  @Prop({ type: String })
  raw_intact_deer_processing: string;

  @Prop({ type: String })
  raw_intact_elk_processing: string;

  @Prop({ type: String })
  raw_intact_goat_processing: string;

  @Prop({ type: String })
  raw_intact_other_voluntary_livestock_processing: string;

  @Prop({ type: String })
  raw_intact_rabbit_processing: string;

  @Prop({ type: String })
  raw_intact_reindeer_processing: string;

  @Prop({ type: String })
  raw_intact_sheep_processing: string;

  @Prop({ type: String })
  raw_intact_yak_processing: string;

  @Prop({ type: String })
  raw_intact_unspecified_meat_processing: string;

  @Prop({ type: String })
  raw_non_intact_beef_processing: string;

  @Prop({ type: String })
  raw_non_intact_pork_processing: string;

  @Prop({ type: String })
  raw_non_intact_antelope_processing: string;

  @Prop({ type: String })
  raw_non_intact_bison_processing: string;

  @Prop({ type: String })
  raw_non_intact_buffalo_processing: string;

  @Prop({ type: String })
  raw_non_intact_deer_processing: string;

  @Prop({ type: String })
  raw_non_intact_elk_processing: string;

  @Prop({ type: String })
  raw_non_intact_goat_processing: string;

  @Prop({ type: String })
  raw_non_intact_other_voluntary_livestock_processing: string;

  @Prop({ type: String })
  raw_non_intact_rabbit_processing: string;

  @Prop({ type: String })
  raw_non_intact_reindeer_processing: string;

  @Prop({ type: String })
  raw_non_intact_sheep_processing: string;

  @Prop({ type: String })
  raw_non_intact_yak_processing: string;

  @Prop({ type: String })
  raw_non_intact_unspecified_meat_processing: string;

  @Prop({ type: String })
  chicken_processing: string;

  @Prop({ type: String })
  duck_processing: string;

  @Prop({ type: String })
  goose_processing: string;

  @Prop({ type: String })
  pigeon_processing: string;

  @Prop({ type: String })
  ratite_processing: string;

  @Prop({ type: String })
  turkey_processing: string;

  @Prop({ type: String })
  exotic_poultry_processing: string;

  @Prop({ type: String })
  other_voluntary_poultry_processing: string;

  @Prop({ type: String })
  unspecified_poultry_processing: string;

  @Prop({ type: String })
  rte_chicken_processing: string;

  @Prop({ type: String })
  rte_duck_processing: string;

  @Prop({ type: String })
  rte_goose_processing: string;

  @Prop({ type: String })
  rte_pigeon_processing: string;

  @Prop({ type: String })
  rte_ratite_processing: string;

  @Prop({ type: String })
  rte_turkey_processing: string;

  @Prop({ type: String })
  rte_exotic_poultry_processing: string;

  @Prop({ type: String })
  rte_other_voluntary_poultry_processing: string;

  @Prop({ type: String })
  rte_unspecified_poultry_processing: string;

  @Prop({ type: String })
  nrte_chicken_processing: string;

  @Prop({ type: String })
  nrte_duck_processing: string;

  @Prop({ type: String })
  nrte_goose_processing: string;

  @Prop({ type: String })
  nrte_pigeon_processing: string;

  @Prop({ type: String })
  nrte_ratite_processing: string;

  @Prop({ type: String })
  nrte_turkey_processing: string;

  @Prop({ type: String })
  nrte_exotic_poultry_processing: string;

  @Prop({ type: String })
  nrte_other_voluntary_poultry_processing: string;

  @Prop({ type: String })
  nrte_unspecified_poultry_processing: string;

  @Prop({ type: String })
  raw_intact_chicken_processing: string;

  @Prop({ type: String })
  raw_intact_duck_processing: string;

  @Prop({ type: String })
  raw_intact_goose_processing: string;

  @Prop({ type: String })
  raw_intact_pigeon_processing: string;

  @Prop({ type: String })
  raw_intact_ratite_processing: string;

  @Prop({ type: String })
  raw_intact_turkey_processing: string;

  @Prop({ type: String })
  raw_intact_exotic_poultry_processing: string;

  @Prop({ type: String })
  raw_intact_other_voluntary_poultry_processing: string;

  @Prop({ type: String })
  raw_intact_unspecified_poultry_processing: string;

  @Prop({ type: String })
  raw_non_intact_chicken_processing: string;

  @Prop({ type: String })
  raw_non_intact_duck_processing: string;

  @Prop({ type: String })
  raw_non_intact_goose_processing: string;

  @Prop({ type: String })
  raw_non_intact_pigeon_processing: string;

  @Prop({ type: String })
  raw_non_intact_ratite_processing: string;

  @Prop({ type: String })
  raw_non_intact_turkey_processing: string;

  @Prop({ type: String })
  raw_non_intact_exotic_poultry_processing: string;

  @Prop({ type: String })
  raw_non_intact_other_voluntary_poultry_processing: string;

  @Prop({ type: String })
  raw_non_intact_unspecified_poultry_processing: string;

  @Prop({ type: String })
  listeria_alternative: string;

  @Prop({ type: String })
  processing_volume_category: string;

  @Prop({ type: String })
  slaughter_volume_category;
}

export const FSISEstDemographicSchema =
  SchemaFactory.createForClass(FSISEstDemographic);

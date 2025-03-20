const mongoose = require("mongoose");

const DicionarioGrupoSchema = new mongoose.Schema({
  cod_item_material: { type: mongoose.Schema.Types.ObjectId, ref: 'CadastroMaterial' },
  cod_criticidade: { type: mongoose.Schema.Types.ObjectId, ref: 'DicionarioCriticidade' },
  data_criticidade: Date,
  deletedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model("DicionarioGrupo",DicionarioGrupoSchema);
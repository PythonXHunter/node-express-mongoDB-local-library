const { DateTime } = require('luxon');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AuthorSchema = Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

AuthorSchema.virtual("name").get(function (){
  let fullName = "";
  if(this.first_name && this.family_name){
    fullName = `${this.first_name}, ${this.family_name}`;
  }

  return fullName;
});

AuthorSchema.virtual("url").get(function (){
  return `/catalog/author/${this._id}`;
});

AuthorSchema.virtual("lifespan").get(function(){
  let lifespanString = "";
  if(this.date_of_birth){
    lifespanString = DateTime.fromJSDate(this.date_of_birth)
      .toLocaleString(DateTime.DATE_MED);
  }
  lifespanString += " - ";
  if(this.date_of_death){
    lifespanString += DateTime.fromJSDate(this.date_of_death)
      .toLocaleString(DateTime.DATE_MED);
  }
  return lifespanString;
});

AuthorSchema.virtual("date_of_birth_formatted").get(function (){
  return this.date_of_birth ? DateTime
    .fromJSDate(this.date_of_birth)
    .toLocaleString(DateTime.DATE_MED) : "";
});

AuthorSchema.virtual("date_of_death_formatted").get(function() {
  return this.date_of_death ? DateTime
    .fromJSDate(this.date_of_death)
    .toLocaleString(DateTime.DATE_MED) : "";
});

module.exports = mongoose.model("Author", AuthorSchema);
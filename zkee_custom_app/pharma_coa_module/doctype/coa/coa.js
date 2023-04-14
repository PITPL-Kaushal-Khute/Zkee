// Copyright (c) 2023, Kaushal and contributors
// For license information, please see license.txt

frappe.ui.form.on('COA',  {

    setup(frm) {
		//both child table "Add Row" button Hide
		frm.set_df_property('signing_authorities', 'cannot_add_rows', true);
		frm.set_df_property('coa_parameter_table', 'cannot_add_rows', true);
    },
	refresh:function(frm){
		frm.set_df_property('signing_authorities', 'cannot_add_rows', true);
		frm.set_df_property('coa_parameter_table', 'cannot_add_rows', true);
		frm.trigger('setup_testing_date');
		//from user doctype fetch full_name in Signing Authorities set as option in name_of_person field
		var arr =[];
		return frappe.call({
			method: "frappe.client.get_list",
			async:false,
			args: {
				doctype: "User",
				fields: ["full_name"],
			},
			callback: function(r) {
				$.each(r.message || [], function (i, v) {
					arr.push(v.full_name);
				})
				var df = frappe.meta.get_docfield("Signing Authorities","name_of_person", cur_frm.doc.name);
				df.options = arr;
				refresh_field('name_of_person')
			}
		})
	},
	product_code:function(frm){
		cur_frm.clear_table("signing_authorities");
		cur_frm.clear_table("coa_parameter_table");

		//in signing_authorities table in coa_asign set static value
		let row = frm.add_child('signing_authorities', {
            coa_asign:"Prepared By",
        });
		let row1= frm.add_child('signing_authorities', {
            coa_asign:"Checked By",
        });
		let row2= frm.add_child('signing_authorities', {
            coa_asign:"Approved By",
        });
   		frm.refresh_field('signing_authorities');

		//in coa_parameter_table automatically add rows
		var temp=[];
		if(frm.doc.product_code){
			// cur_frm.clear_table("coa_parameter_table")
			frappe.call({
				method: "zkee_custom_app.pharma_coa_module.doctype.coa.coa.get_product_parameter_list",
				async: false,
				args: {product_name:frm.doc.product_name},
				callback: function(r) {
					console.log(r.message);
					temp = r.message;
				}
			})
			temp.forEach(ppl_list => {
				let row = frm.add_child("coa_parameter_table", {
					test: ppl_list.test,
					specification:ppl_list.specification,
				});
			})
			frm.refresh_field('coa_parameter_table');	
		}
	},
	before_save:function(frm){
		//set trslip_no number
		const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		const d = new Date();
		// let month = months[d.getMonth()];
		let month_index = months.indexOf(months[d.getMonth()]);
		let month = month_index +1;

		var getCurrentYear =  d.getFullYear(); // get current year//2023
		var getTwodigitcurrentYear = getCurrentYear.toString().substring(2);//23

		const trslip_no = "ZQC"+ "/" + month + "/" + getTwodigitcurrentYear
		frm.set_value("trslip_no",trslip_no)
	},
	//on plant_address select get primary_address
	plant_address: function(frm){
		if(frm.doc.address){
			frappe.call({
				method: 'frappe.contacts.doctype.address.address.get_address_display',
				args: {
					"address_dict": frm.doc.address
				},
				callback: function(r) {
					frm.set_value("primary_address", r.message);
				}
			});
		}
		if(!frm.doc.address){
			frm.set_value("primary_address", "");
		}
		//in plant doctype child table mfg_lic_no all rows get and set as option in mfg_lic_no coa doctype Field
		if(frm.doc.plant_address){
			frappe.call({
				method: "zkee_custom_app.pharma_coa_module.doctype.coa.coa.get_mfg_lic_no_list",
				async:false,
				args: {plant_address:frm.doc.plant_address},
				callback: function(r) {
					$.each(r.message || [], function (i, v) {
						frm.set_df_property("mfg_lic_no", "options", r.message)
						refresh_field('mfg_lic_no')
					})
				}
			})
		}
	},
	release_quantity: function(frm){
		if(frm.doc.release_quantity){
			if (frm.doc.coabatch_size < frm.doc.release_quantity){
				frappe.call({
					method: "zkee_custom_app.pharma_coa_module.doctype.coa.coa.release_quantity",
					async:false,
					// args: {release_quantity:frm.doc.release_quantity,
					// 	batch_size:frm.doc.coabatch_size,
					// 	doc_name:frm.docname
					// },
					callback: function(r) {
						if(r.message == "True")
						{
							frm.set_value("release_quantity", null)
						}
					}
				})
			}
		}
	},
	//in print format show Manufacturing Date in format -> April,2023
	mfg_date: function(frm){
		const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		const date = new Date(frm.doc.mfg_date);
		let month = months[date.getMonth()];
		var year = date.getFullYear();
		const mfg_month_and_year = month + "," + year
		frm.set_value("mfg_month_and_year",mfg_month_and_year)
	},

	//in print format show Expiry Date in format -> April,2023
	// exp_date: function(frm){
		
	// },
	//in test_as_per get in  conclusion field automatically default text set
	test_as_per:function(frm){
		const conclusion = "The Above Sample complies as per " + frm.doc.test_as_per + "\nThe Opinion of the undersigned the sample referred to above is of Standard quality as defined in the Act and the Rules made there under for result given above. " 
		frm.set_value("conclusion",conclusion)
	},
	//Release quantity Should be Equal or Less than Batch Size
	exp_date:function(frm){
		const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		const date = new Date(frm.doc.exp_date);
		let month = months[date.getMonth()];
		var year = date.getFullYear();
		const exp_month_and_year = month + "," + year
		frm.set_value("exp_month_and_year",exp_month_and_year)
		if(frm.doc.exp_date){
			frappe.call({
				method: "zkee_custom_app.pharma_coa_module.doctype.coa.coa.exp_date",
				async:false,
				args: {exp_date:frm.doc.exp_date,
					mfg_date:frm.doc.mfg_date,
				},
				callback: function(r) {
					if(r.message == "True")
					{
						frm.set_value("exp_date", null)
					}
				}
			})
		}
	},
	setup_testing_date(frm) {
		let today = new Date();

		// setting datepicker options to set min date & min time
		
		frm.get_field('testing_date').$input.datepicker({
			
			minDate: today,
			
			onSelect: function (fd, d, picker) {
				if (!d) return;
				var date = d.toDateString();
				if (date === today.toDateString()) {
					// picker.update({
					// 	minHours: (today.getHours() + 1)
					// });
				// } else {
				// 	picker.update({
				// 		minHours: 0
				// 	});
				}
				frm.get_field('testing_date').$input.trigger('change');
			}
		});
	}
})

frappe.ui.form.on("Signing Authorities", {
	name_of_person:function(frm,cdt,cdn) {
		var d = locals[cdt][cdn];
		frappe.db.get_value("User", { "full_name": d.name_of_person}, ["designation"],function (value){
			frappe.model.set_value(d.doctype, d.name, "designation", value.designation)
			refresh_field('Signing Authorities')
		});
	},
});
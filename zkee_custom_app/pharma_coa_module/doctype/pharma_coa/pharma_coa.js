// Copyright (c) 2023, Kaushal and contributors
// For license information, please see license.txt

frappe.ui.form.on('Pharma COA',  {
    setup(frm) {
		frm.set_df_property('signing_authorities', 'cannot_add_rows', true);
		frm.set_df_property('coa_parameter_table', 'cannot_add_rows', true);
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
			}
		})
    },
	product_code:function(frm){
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
		var temp=[];
		if(frm.doc.product_code){
			frm.clear_table("coa_parameter_table")
			frappe.call({
				method: "zkee_custom_app.pharma_coa_module.doctype.pharma_coa.pharma_coa.get_product_parameter_list",
				async:false,
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
		const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		const d = new Date();
		// let month = months[d.getMonth()];
		let month_index = months.indexOf(months[d.getMonth()]);
		let month = month_index +1;

		var getCurrentYear =  d.getFullYear(); // get current year//2023
		var getTwodigitcurrentYear = getCurrentYear.toString().substring(2);//23
		var getnextYear =  getCurrentYear+1;//2024
		var getTwodigitnextYear = getnextYear.toString().substring(2);//24

		var year = getTwodigitcurrentYear + "-" + getTwodigitnextYear
		const ar_number = "ZQC"+ "/" + month + "/" + year
		frm.set_value("arno",ar_number)
		const trslip_no = "ZQC"+ "/" + month + "/" + getTwodigitcurrentYear
		frm.set_value("trslip_no",trslip_no)
	
	},
	address: function(frm){
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
	},

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

frappe.ui.form.on('Pharma COA', {
	validate: function(frm) {
		const date = new Date(moment(frm.doc.date).endOf('month').format('YYYY-MM-DD'));
		frm.set_value("date",date)
	},	
	date: function(frm){
		const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		const date = new Date(frm.doc.date);
		let month = months[date.getMonth()];
		frm.set_value("month",month)
		var year = date.getFullYear();
		frm.set_value("year",year)
	}
}); 

// Copyright (c) 2023, Kaushal and contributors
// For license information, please see license.txt

frappe.ui.form.on('Plant', {
	//call get_address_display python function to get primary_address
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
});

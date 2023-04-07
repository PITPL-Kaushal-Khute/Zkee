// Copyright (c) 2023, Kaushal and contributors
// For license information, please see license.txt

frappe.ui.form.on('Cost Sheet', {
	//select drop item name show in name of product field
	refresh:function(frm){
		var arr =[];
		return frappe.call({
			method: "frappe.client.get_list",
			async:false,
			args: {
				doctype: "Item",
				fields: ["item_name"],
			},
			callback: function(r) {
				$.each(r.message || [], function (i, v) {
					arr.push(v.item_name);
				})
				frm.set_df_property("name_of_product", "options", arr)
				refresh_field('name_of_product')
			}
		})
	},
	// same product packing fetch
	product_code:function(frm) {
		frappe.db.get_value('Item', { "name": frm.doc.product_code}, 'packing', (values) => {
			frm.set_value("packing", values.packing);
			refresh_field('packing')
		});
	},
	//total_quantity function mention in child table call in parent table in here total quantity calculate cost_sheet_raw_material_table for each row
	total_quantity: function (frm) {
		var total = 0.0;
		$.each(frm.doc.cost_sheet_raw_material_table || [], function (i, row) {
			if (row.quantity) {
				total += flt(row.quantity);
			}
		});
		frm.set_value("total_quantity", Math.abs(total));
		refresh_field('total_quantity')
		frm.set_df_property('total_quantity', 'read_only', 1);
	},
	//in cost_sheet_raw_material_table calculate sum of ratepack
	total_raw_material_ratepack: function (frm) {
		var total = 0.0;
		$.each(frm.doc.cost_sheet_raw_material_table || [], function (i, row) {
			if (row.quantity) {
				total += flt(row.ratepack);
			}
		});
		frm.set_value("total_raw_material_ratepack", Math.abs(total));
		refresh_field('total_raw_material_ratepack')
		frm.set_df_property('total_raw_material_ratepack', 'read_only', 1);

		//also above Math.abs(total) set in  raw_material_cost field
		frm.set_value("raw_material_cost", Math.abs(total));
		frm.set_df_property('raw_material_cost', 'read_only', 1);
		refresh_field('raw_material_cost')

		//In total_raw_material_ratepack on condition converstion_cost will set 
		if (frm.doc.total_raw_material_ratepack <= 100 && frm.doc.total_raw_material_ratepack >= 90) {
			frm.set_value("converstion_cost", 7);
			refresh_field('converstion_cost')
			frm.set_df_property('converstion_cost', 'read_only', 1);

		  } else if (frm.doc.total_raw_material_ratepack <= 89 && frm.doc.total_raw_material_ratepack >= 70) {
			frm.set_value("converstion_cost", 6);
			refresh_field('converstion_cost')
			frm.set_df_property('converstion_cost', 'read_only', 1);

		  } else if (frm.doc.total_raw_material_ratepack <= 69 && frm.doc.total_raw_material_ratepack >= 50) {
			frm.set_value("converstion_cost", 5);
			refresh_field('converstion_cost')
			frm.set_df_property('converstion_cost', 'read_only', 1);
		
		  } else if (frm.doc.total_raw_material_ratepack <= 49 && frm.doc.total_raw_material_ratepack >= 30) {
			frm.set_value("converstion_cost", 4);
			refresh_field('converstion_cost')
			frm.set_df_property('converstion_cost', 'read_only', 1);
		
		  }else if (frm.doc.total_raw_material_ratepack <= 29 && frm.doc.total_raw_material_ratepack >= 20) {
			frm.set_value("converstion_cost", 3);
			refresh_field('converstion_cost')
			frm.set_df_property('converstion_cost', 'read_only', 1);
		  }  else {
			frm.set_value("converstion_cost", 2);
			refresh_field('converstion_cost')
			frm.set_df_property('converstion_cost', 'read_only', 1);
		  }
	},
	//	//in cost_sheet_raw_material_table calculate sum of ratepack
	total_packaging_material_ratepack: function (frm) {
		var total = 0.0;
		$.each(frm.doc.cost_sheet_packaging_material_table|| [], function (i, row) {
			if (row.quantity) {
				total += flt(row.ratepack);
			}
		});
		frm.set_value("total_packaging_material_ratepack", Math.abs(total));
		refresh_field('total_packaging_material_ratepack')
		frm.set_df_property('total_packaging_material_ratepack', 'read_only', 1);

			
		//also above Math.abs(total) set in  packaging_material_cost field
		frm.set_value("packaging_material_cost", Math.abs(total));
		frm.set_df_property('packaging_material_cost', 'read_only', 1);
		refresh_field('packaging_material_cost')

		//In total_packaging_material_ratepack on condition converstion_cost will set 
		if (frm.doc.total_packaging_material_ratepack <= 100 && frm.doc.total_packaging_material_ratepack >= 90) {
			frm.set_value("packing_cost", 7);
			refresh_field('packing_cost')
			frm.set_df_property('packing_cost', 'read_only', 1);

		  } else if (frm.doc.total_packaging_material_ratepack <= 89 && frm.doc.total_packaging_material_ratepack >= 70) {
			frm.set_value("packing_cost", 6);
			refresh_field('packing_cost')
			frm.set_df_property('packing_cost', 'read_only', 1);

		  } else if (frm.doc.total_packaging_material_ratepack <= 69 && frm.doc.total_packaging_material_ratepack >= 50) {
			frm.set_value("packing_cost", 5);
			refresh_field('packing_cost')
			frm.set_df_property('packing_cost', 'read_only', 1);
		
		  } else if (frm.doc.total_packaging_material_ratepack <= 49 && frm.doc.total_packaging_material_ratepack >= 30) {
			frm.set_value("packing_cost", 4);
			refresh_field('packing_cost')
			frm.set_df_property('packing_cost', 'read_only', 1);
		
		  }else if (frm.doc.total_packaging_material_ratepack <= 29 && frm.doc.total_packaging_material_ratepack >= 20) {
			frm.set_value("packing_cost", 3);
			refresh_field('packing_cost')
			frm.set_df_property('packing_cost', 'read_only', 1);
		  }  else {
			frm.set_value("packing_cost", 2);
			refresh_field('packing_cost')
			frm.set_df_property('packing_cost', 'read_only', 1);
		  }
	},
	//if product packing is change tehn both child table is clear(remove all row)
	packing: function(frm) {
		if (frm.doc.packing === "" || frm.doc.packing != "") {
			frm.clear_table("cost_sheet_raw_material_table");
			frm.clear_table("cost_sheet_packaging_material_table");
			frm.refresh_fields();
		}
	},
	//enter margin_in_percent on that margin will calculate
	margin_in_percent:function(frm){
		frm.set_value("margin", Math.abs((frm.doc.raw_material_cost + frm.doc.packaging_material_cost)* (frm.doc.margin_in_percent/100)));
		frm.set_df_property('margin', 'read_only', 1);
		refresh_field('margin');
	},
    //if enter or change packaging_material_cost then total also change
	packaging_material_cost: function(frm){
		frm.set_value("total", flt(frm.doc.packaging_material_cost) + flt(frm.doc.raw_material_cost)+ flt(frm.doc.margin)+flt(frm.doc.converstion_cost)+flt(frm.doc.packing_cost));
		frm.set_df_property('total', 'read_only', 1);
	},
	//if enter or change raw_material_cost_material_cost then total also change
	raw_material_cost_material_cost: function(frm){
		frm.set_value("total", flt(frm.doc.packaging_material_cost) + flt(frm.doc.raw_material_cost)+ flt(frm.doc.margin)+flt(frm.doc.converstion_cost)+flt(frm.doc.packing_cost));
		frm.set_df_property('total', 'read_only', 1);
	},
	//if enter or change margin then total also change
	margin: function(frm){
		frm.set_value("total", flt(frm.doc.packaging_material_cost) + flt(frm.doc.raw_material_cost)+ flt(frm.doc.margin)+flt(frm.doc.converstion_cost)+flt(frm.doc.packing_cost));
		frm.set_df_property('total', 'read_only', 1);
	},
	//if enter or change converstion_cost then total also change
	converstion_cost: function(frm){
		frm.set_value("total", flt(frm.doc.packaging_material_cost) + flt(frm.doc.raw_material_cost)+ flt(frm.doc.margin)+flt(frm.doc.converstion_cost)+flt(frm.doc.packing_cost));
		frm.set_df_property('total', 'read_only', 1);
	},
	//if enter or change packing_cost then total also change
	packing_cost: function(frm){
		frm.set_value("total", flt(frm.doc.packaging_material_cost) + flt(frm.doc.raw_material_cost)+ flt(frm.doc.margin)+flt(frm.doc.converstion_cost)+flt(frm.doc.packing_cost));
		frm.set_df_property('total', 'read_only', 1);
	},

	//if enter or change packing_cost then calculate process_loss_amount and price_per_pack 
	process_loss: function(frm){
		frm.set_value("process_loss_amount", flt(frm.doc.total * frm.doc.process_loss)/100);
		refresh_field('process_loss_amount');
		frm.set_value("price_per_pack", flt(frm.doc.total)+flt(frm.doc.process_loss_amount));
		frm.set_df_property('price_per_pack', 'read_only', 1);
	},
	price_per_pack:function(frm){
		frappe.call({
			async:false,
			method: "erpnext.setup.utils.get_exchange_rate",
			args: {
				from_currency: "USD",
		 		to_currency: "INR",
			},
			callback: function(r) {
				frm.set_value("doller_value_in_rupees", flt(r.message));

			}
		})
		frm.set_value("price_per_pack_in_doller", flt(frm.doc.price_per_pack)/ flt(frm.doc.doller_value_in_rupees));
		cur_frm.set_currency_labels(["price_per_pack_in_doller"], "USD")
		refresh_field('price_per_pack_in_doller');
	},
	//if enter or change packing_cost then calculate total
	total:function(frm){
		frm.set_value("price_per_pack", flt(frm.doc.total)+flt(frm.doc.process_loss_amount));
		frm.set_df_property('price_per_pack', 'read_only', 1);
	}
});

frappe.ui.form.on("Cost Sheet Raw Material Table", {
	//Cost Sheet Raw Material Table calculate each row total and ratepack
	quantity:function(frm,cdt,cdn) {
		var row = locals[cdt][cdn];
		frappe.model.set_value(cdt, cdn, 'total', row.rate * row.quantity);
		refresh_field('total')
		frappe.model.set_value(cdt, cdn, 'ratepack', row.total/(100000/frm.doc.number_of_packets));
		refresh_field('ratepack')
		frm.events.total_quantity(frm);
	},
	//Cost Sheet Raw Material Table row is remove the total is change
	cost_sheet_raw_material_table_remove: function (frm) {
		frm.events.total_quantity(frm);
		frm.events.total_raw_material_ratepack(frm);
	},
	ratepack:function(frm){
		frm.events.total_raw_material_ratepack(frm);
	}
});

frappe.ui.form.on("Cost Sheet Packaging Material Table", {
	//Cost Sheet Packaging Material Table calculate each row total and ratepack
	quantity:function(frm,cdt,cdn) {
		var row = locals[cdt][cdn];
		frappe.model.set_value(cdt, cdn, 'total', row.rate * row.quantity);
		refresh_field('total')
		frappe.model.set_value(cdt, cdn, 'ratepack', row.total/(100000/frm.doc.number_of_packets));
		refresh_field('ratepack')
	},
	//Cost Sheet Packaging Material Table row is remove the total is change
	cost_sheet_packaging_material_table_remove: function (frm) {
		frm.events.total_packaging_material_ratepack(frm);
	},
	ratepack:function(frm){
		frm.events.total_packaging_material_ratepack(frm);
	}
});
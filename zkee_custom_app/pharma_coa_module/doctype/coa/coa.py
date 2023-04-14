# Copyright (c) 2023, Kaushal and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
import datetime
from frappe.model.naming import make_autoname


class COA(Document):
	#arno set automatically following format
	def autoname(self):
		today = datetime.date.today()
		year = today.year
		self.arno = make_autoname(("ZI"+ "/" + "QC" + "/" +(str(year)) + "/" + "-.##")
		)
	
	#on update create batch (1'st time form is save then create batch)
	def on_update(self):
		if frappe.db.exists({"doctype": "Batch", "batch_id": self.batch_no}):
			pass
		else:
			batch_data = frappe.new_doc("Batch")
			batch_data.item = self.product_code
			batch_data.batch_id = self.batch_no
			batch_data.manufacturing_date= self.mfg_date
			batch_data.expiry_date= self.exp_date
			batch_data.insert(ignore_mandatory=True)

	#get primary_address
	def create_primary_address(self):
		from frappe.contacts.doctype.address.address import get_address_display
		if self.flags.is_new_doc and self.get("address_line1"):
			address = make_address(self)
			address_display = get_address_display(address.name)
			self.db_set("address", address.name)
			self.db_set("primary_address", address_display)


@frappe.whitelist()
#get_product_parameter_list
def get_product_parameter_list(product_name):
	product_parameter= frappe.get_doc("Product Parameter",product_name)
	person_data = []
	for product_parameter in product_parameter.get("product_parameter_table"):
		person_data.append(product_parameter)
	return person_data

	
@frappe.whitelist()
#get_mfg_lic_no_list
def get_mfg_lic_no_list(plant_address):
	plant= frappe.get_doc("Plant",plant_address)
	mfg_lic_no = []
	for person in plant.get("manufacturing_license_number_table"):
		mfg_lic_no.append(person.manufacturing_license_number)
	return mfg_lic_no

@frappe.whitelist()
def release_quantity():
	value = ""
	frappe.msgprint(msg='Release quantity Should be Equal or Less than Batch Size',title='Error')
	value = "True"
	return value

@frappe.whitelist()
def exp_date(exp_date,mfg_date):
	value = ""
	if  exp_date <  mfg_date :
		frappe.msgprint(msg='Expiry date should be greater than Manufacturing date',
    	title='Error')
		value = "True"
	return value


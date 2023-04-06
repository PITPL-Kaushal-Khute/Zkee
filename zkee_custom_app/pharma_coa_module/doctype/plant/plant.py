# Copyright (c) 2023, Kaushal and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Plant(Document):
	def on_update(self):
		#on plant form save create link to address child table
		# frappe.msgprint(self.doc,"self.doc")
		address= frappe.get_doc("Address",self.address)
		d = address.append("links",
		    {
		        "link_doctype" : "Plant",
		        "link_name": self.name,
            }
        )
		address.save()
	#if address is select then primary_address get
	def create_primary_address(self):
		from frappe.contacts.doctype.address.address import get_address_display
		if self.flags.is_new_doc and self.get("address_line1"):
			address = make_address(self)
			address_display = get_address_display(address.name)
			self.db_set("address", address.name)
			self.db_set("primary_address", address_display)
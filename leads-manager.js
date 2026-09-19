/**
 * BlueRay Wealth - Lead Capture & Management Engine
 * Handles lead persistence, Email dispatch, WhatsApp link generation, and CSV export.
 */
(function (window) {
  'use strict';

  const STORAGE_KEY = 'blueray_leads_db';

  const LeadsManager = {
    // Retrieve all leads
    getAll: function () {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        console.error('Failed to load leads from storage:', e);
        return [];
      }
    },

    // Save a new lead
    addLead: function (leadData) {
      const leads = this.getAll();
      const newLead = Object.assign({
        id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        createdAt: new Date().toISOString(),
        createdDisplay: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        status: 'new', // new, contacted, converted, archived
        notes: ''
      }, leadData);

      leads.unshift(newLead); // Latest first

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
      } catch (e) {
        console.error('Failed to save lead to localStorage:', e);
      }

      // Automatically dispatch email notification in background
      this.dispatchEmailNotification(newLead);

      return newLead;
    },

    // Update lead status
    updateStatus: function (id, newStatus) {
      const leads = this.getAll();
      const idx = leads.findIndex(l => l.id === id);
      if (idx !== -1) {
        leads[idx].status = newStatus;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
        return true;
      }
      return false;
    },

    // Update admin notes on lead
    updateNotes: function (id, notes) {
      const leads = this.getAll();
      const idx = leads.findIndex(l => l.id === id);
      if (idx !== -1) {
        leads[idx].notes = notes;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
        return true;
      }
      return false;
    },

    // Delete a lead
    deleteLead: function (id) {
      let leads = this.getAll();
      leads = leads.filter(l => l.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
      return true;
    },

    // Build pre-filled WhatsApp message URL
    getWhatsAppUrl: function (lead) {
      const cfg = window.SiteConfig ? window.SiteConfig.get() : { whatsappNumber: '919923861051' };
      const phone = cfg.whatsappNumber.replace(/[^\d]/g, '');

      let msg = *New Lead / Consultation Request*\n;
      msg += 👤 *Name:* \n;
      msg += 📱 *Mobile:* +91 \n;
      if (lead.email) msg += ✉️ *Email:* \n;
      if (lead.city) msg += 📍 *City:* \n;
      if (lead.investorType) msg += 💼 *Investor Type:* \n;
      if (lead.goal) msg += 🎯 *Goal:* \n;
      if (lead.amount) msg += 💰 *Approx Amount:* \n;
      if (lead.method) msg += 📞 *Preferred Contact:* \n;
      if (lead.message) msg += 💬 *Message:* \n;
      msg += 🕒 *Received:* \n;
      msg += \n_BlueRay Wealth - Trust • Guidance • Growth_;

      return https://wa.me/?text=;
    },

    // Dispatch email to configured recipient (blueraywealth0007@gmail.com)
    dispatchEmailNotification: function (lead) {
      const cfg = window.SiteConfig ? window.SiteConfig.get() : { notificationEmail: 'blueraywealth0007@gmail.com' };
      const targetEmail = cfg.notificationEmail || 'blueraywealth0007@gmail.com';

      // 1. If Web3Forms access key is configured, use Web3Forms API
      if (cfg.web3FormsKey) {
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            access_key: cfg.web3FormsKey,
            subject: New BlueRay Wealth Lead:  (),
            from_name: 'BlueRay Wealth Portal',
            name: lead.name,
            mobile: lead.mobile,
            email: lead.email || 'Not Provided',
            city: lead.city || 'Not Provided',
            investor_type: lead.investorType || 'N/A',
            goal: lead.goal || 'N/A',
            amount: lead.amount || 'N/A',
            contact_method: lead.method || 'N/A',
            message: lead.message || 'No additional message',
            timestamp: lead.createdDisplay
          })
        }).catch(err => console.warn('Web3Forms dispatch error:', err));
        return;
      }

      // 2. Default: FormSubmit.co AJAX delivery (Free, direct to email)
      const formPayload = {
        name: lead.name,
        mobile: +91 ,
        email: lead.email || 'N/A',
        city: lead.city || 'N/A',
        goal: lead.goal || 'N/A',
        amount: lead.amount || 'N/A',
        investor_type: lead.investorType || 'N/A',
        preferred_contact: lead.method || 'N/A',
        message: lead.message || 'No note',
        source: lead.source || 'Website Modal',
        _subject: New Lead:  (+91 ) - BlueRay Wealth,
        _template: 'table',
        _captcha: 'false'
      };

      fetch(https://formsubmit.co/ajax/, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formPayload)
      })
      .then(res => res.json())
      .then(data => {
        console.log('FormSubmit notification status:', data);
      })
      .catch(err => {
        console.warn('FormSubmit background dispatch note:', err);
      });
    },

    // Export all leads to CSV
    exportToCSV: function () {
      const leads = this.getAll();
      if (!leads.length) {
        alert('No leads available to export.');
        return;
      }

      const headers = ['ID', 'Date & Time', 'Status', 'Name', 'Mobile', 'Email', 'City', 'Investor Type', 'Goal', 'Investment Amount', 'Preferred Contact', 'Message', 'Notes'];
      
      const rows = leads.map(l => [
        "",
        "",
        "",
        "",
        "'+91 ",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', lueray_leads_.csv);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  window.LeadsManager = LeadsManager;
})(window);

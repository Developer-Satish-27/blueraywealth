/**
 * BlueRay Wealth - Lead Capture & Notification Engine
 * Accurately dispatches leads to Email (FormSubmit) and generates WhatsApp links.
 */
(function (window) {
  'use strict';

  var STORAGE_KEY = 'blueray_leads_db';

  var LeadsManager = {
    // Retrieve all leads
    getAll: function () {
      try {
        var stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        console.error('Failed to load leads from storage:', e);
        return [];
      }
    },

    // Save a new lead
    addLead: function (leadData) {
      var leads = this.getAll();
      var now = new Date();
      var newLead = Object.assign({
        id: 'lead_' + now.getTime() + '_' + Math.random().toString(36).substr(2, 5),
        createdAt: now.toISOString(),
        createdDisplay: now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        status: 'new',
        notes: ''
      }, leadData);

      leads.unshift(newLead);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
      } catch (e) {
        console.warn('Storage quota note:', e);
      }

      // Automatically dispatch email notification in background
      this.dispatchEmailNotification(newLead);

      return newLead;
    },

    // Update lead status
    updateStatus: function (id, newStatus) {
      var leads = this.getAll();
      var idx = leads.findIndex(function (l) { return l.id === id; });
      if (idx !== -1) {
        leads[idx].status = newStatus;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
        return true;
      }
      return false;
    },

    // Delete a lead
    deleteLead: function (id) {
      var leads = this.getAll().filter(function (l) { return l.id !== id; });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
      return true;
    },

    // Build pre-filled WhatsApp message URL
    getWhatsAppUrl: function (lead) {
      var cfg = window.SiteConfig ? window.SiteConfig.get() : { whatsappNumber: '919923861051' };
      var phone = (cfg.whatsappNumber || '919923861051').replace(/[^\d]/g, '');

      var msg = '*New Consultation Request - BlueRay Wealth*\n';
      msg += '👤 *Name:* ' + (lead.name || 'N/A') + '\n';
      msg += '📱 *Mobile:* +91 ' + (lead.mobile || 'N/A') + '\n';
      if (lead.email) msg += '✉️ *Email:* ' + lead.email + '\n';
      if (lead.city) msg += '📍 *City:* ' + lead.city + '\n';
      if (lead.investorType) msg += '💼 *Investor Type:* ' + lead.investorType + '\n';
      if (lead.goal) msg += '🎯 *Goal:* ' + lead.goal + '\n';
      if (lead.amount) msg += '💰 *Approx Amount:* ' + lead.amount + '\n';
      if (lead.method) msg += '📞 *Preferred Contact:* ' + lead.method + '\n';
      if (lead.message) msg += '💬 *Message:* ' + lead.message + '\n';
      msg += '🕒 *Time:* ' + (lead.createdDisplay || new Date().toLocaleString()) + '\n';
      msg += '\n_BlueRay Wealth - Trust • Guidance • Growth_';

      return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg);
    },

    // Dispatch email to configured recipient (blueraywealth0007@gmail.com)
    dispatchEmailNotification: function (lead) {
      var cfg = window.SiteConfig ? window.SiteConfig.get() : { notificationEmail: 'blueraywealth0007@gmail.com' };
      var targetEmail = cfg.notificationEmail || 'blueraywealth0007@gmail.com';

      // 1. If Web3Forms access key is configured, use Web3Forms API
      if (cfg.web3FormsKey) {
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            access_key: cfg.web3FormsKey,
            subject: 'New BlueRay Wealth Lead: ' + lead.name + ' (' + lead.mobile + ')',
            from_name: 'BlueRay Wealth Portal',
            name: lead.name,
            mobile: '+91 ' + lead.mobile,
            email: lead.email || 'Not Provided',
            city: lead.city || 'Not Provided',
            investor_type: lead.investorType || 'N/A',
            goal: lead.goal || 'N/A',
            amount: lead.amount || 'N/A',
            contact_method: lead.method || 'N/A',
            message: lead.message || 'No additional message',
            timestamp: lead.createdDisplay
          })
        }).catch(function (err) { console.warn('Web3Forms dispatch note:', err); });
        return;
      }

      // 2. Default: FormSubmit.co AJAX delivery (Free, direct to email)
      var formPayload = {
        name: lead.name,
        mobile: '+91 ' + lead.mobile,
        email: lead.email || 'N/A',
        city: lead.city || 'N/A',
        goal: lead.goal || 'N/A',
        amount: lead.amount || 'N/A',
        investor_type: lead.investorType || 'N/A',
        preferred_contact: lead.method || 'N/A',
        message: lead.message || 'No note',
        source: lead.source || 'Website Modal',
        _subject: 'New Lead: ' + lead.name + ' (+91 ' + lead.mobile + ') - BlueRay Wealth',
        _template: 'table',
        _captcha: 'false'
      };

      fetch('https://formsubmit.co/ajax/' + encodeURIComponent(targetEmail), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formPayload)
      })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        console.log('FormSubmit notification response:', data);
      })
      .catch(function (err) {
        console.warn('FormSubmit dispatch note:', err);
      });
    },

    // Export all leads to CSV
    exportToCSV: function () {
      var leads = this.getAll();
      if (!leads.length) {
        alert('No leads available to export.');
        return;
      }

      var headers = ['ID', 'Date & Time', 'Status', 'Name', 'Mobile', 'Email', 'City', 'Investor Type', 'Goal', 'Investment Amount', 'Preferred Contact', 'Message', 'Notes'];
      
      var rows = leads.map(function (l) {
        return [
          '"' + l.id + '"',
          '"' + (l.createdDisplay || l.createdAt) + '"',
          '"' + l.status + '"',
          '"' + (l.name || '').replace(/"/g, '""') + '"',
          '"+91 ' + (l.mobile || '') + '"',
          '"' + (l.email || '').replace(/"/g, '""') + '"',
          '"' + (l.city || '').replace(/"/g, '""') + '"',
          '"' + (l.investorType || '').replace(/"/g, '""') + '"',
          '"' + (l.goal || '').replace(/"/g, '""') + '"',
          '"' + (l.amount || '').replace(/"/g, '""') + '"',
          '"' + (l.method || '').replace(/"/g, '""') + '"',
          '"' + (l.message || '').replace(/"/g, '""') + '"',
          '"' + (l.notes || '').replace(/"/g, '""') + '"'
        ];
      });

      var csvContent = '\uFEFF' + [headers.join(',')].concat(rows.map(function (r) { return r.join(','); })).join('\r\n');
      var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'blueray_leads_' + new Date().toISOString().slice(0, 10) + '.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  window.LeadsManager = LeadsManager;
})(window);

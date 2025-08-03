// Data harga
const hargaMenu = {
  "Pecel Ayam Paha Atas": 18000,
  "Pecel Ayam Sayap": 18000,
  "Pecel Ayam Dada": 18000,
  "Pecel Ayam Paha Bawah": 16000,
  "Pecel Lele": 18000
};

const hargaExtra = {
  "Tahu Tempe": 5000,
  "Sate Ati Ampela": 3000,
  "Sate Usus": 3000,
  "Sate Kulit": 3000,
  "Kol Goreng": 3000,
  "Extra Nasi": 3000
};

const hargaMinum = {
  "Es Teh Manis": 3000,
  "Es Jeruk": 5000,
  "Air Mineral": 5000
};

let itemCounter = 0;

// Inisialisasi saat dokumen siap
document.addEventListener('DOMContentLoaded', function() {
  // Tambahkan event listeners
  document.getElementById('addMenuBtn').addEventListener('click', () => addItem('menu'));
  document.getElementById('addExtraBtn').addEventListener('click', () => addItem('extra'));
  document.getElementById('addDrinkBtn').addEventListener('click', () => addItem('drink'));
  
  // Tambahkan item awal
  addItem('menu');
  addItem('extra');
  addItem('drink');
  
  // Update preview awal
  updateOrderPreview();
  
  // Form submission
  document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();
    submitOrder();
  });
  
  // Animasi form group
  const formGroups = document.querySelectorAll('.form-group');
  formGroups.forEach(group => {
    group.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
      this.style.transition = 'transform 0.3s ease';
    });
    
    group.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
});

function addItem(type) {
  itemCounter++;
  const container = {
    'menu': document.getElementById('menuContainer'),
    'extra': document.getElementById('extraContainer'),
    'drink': document.getElementById('drinkContainer')
  }[type];

  const hargaMap = { menu: hargaMenu, extra: hargaExtra, drink: hargaMinum }[type];

  const row = document.createElement('div');
  row.className = 'item-row';
  row.style.animationDelay = `${itemCounter * 0.1}s`;

  const select = document.createElement('select');
  const defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.textContent = `Pilih ${type === 'menu' ? 'menu utama' : type === 'extra' ? 'extra menu' : 'minuman'}...`;
  select.appendChild(defaultOpt);

  for (let item in hargaMap) {
    const opt = document.createElement('option');
    opt.value = item;
    opt.textContent = `${item} - Rp ${hargaMap[item].toLocaleString('id-ID')}`;
    select.appendChild(opt);
  }

  const qtyGroup = document.createElement('div');
  qtyGroup.className = 'qty-group';

  const btnMin = document.createElement('button');
  btnMin.type = 'button';
  btnMin.className = 'qty-btn';
  btnMin.textContent = '−';

  const btnPlus = document.createElement('button');
  btnPlus.type = 'button';
  btnPlus.className = 'qty-btn';
  btnPlus.textContent = '+';

  const spanQty = document.createElement('span');
  spanQty.className = 'qty-display';
  spanQty.textContent = '1';

  btnMin.onclick = () => {
    let qty = parseInt(spanQty.textContent);
    if (qty > 1) {
      spanQty.textContent = qty - 1;
      updateTotal();
      updateOrderPreview();
    }
  };

  btnPlus.onclick = () => {
    let qty = parseInt(spanQty.textContent);
    spanQty.textContent = qty + 1;
    updateTotal();
    updateOrderPreview();
  };

  select.onchange = function() {
    updateTotal();
    updateOrderPreview();
    
    if (type === 'menu') {
      const existingSambal = row.querySelector('.sambal-section');
      if (!existingSambal && this.value) {
        addSambalSection(row, this.value);
      }
    }
  };

  qtyGroup.appendChild(btnMin);
  qtyGroup.appendChild(spanQty);
  qtyGroup.appendChild(btnPlus);

  row.appendChild(select);
  row.appendChild(qtyGroup);
  container.appendChild(row);
  
  if (type === 'menu') {
    addSambalSection(row, '');
  }
  
  updateTotal();
  updateOrderPreview();
}

function addSambalSection(row, menuName) {
  const sambalSection = document.createElement('div');
  sambalSection.className = 'sambal-section';
  
  const title = document.createElement('div');
  title.className = 'sambal-title';
  title.textContent = 'Pilih Sambal:';
  sambalSection.appendChild(title);
  
  const options = document.createElement('div');
  options.className = 'sambal-options';
  
  // Sambal Merah
  const merahOption = document.createElement('div');
  merahOption.className = 'sambal-option';
  
  const merahLabel = document.createElement('div');
  merahLabel.className = 'sambal-label';
  merahLabel.textContent = '🔥 Merah (Sedang)';
  merahOption.appendChild(merahLabel);
  
  const merahQtyGroup = document.createElement('div');
  merahQtyGroup.className = 'qty-group';
  
  const merahMin = document.createElement('button');
  merahMin.type = 'button';
  merahMin.className = 'qty-btn';
  merahMin.textContent = '−';
  
  const merahQty = document.createElement('span');
  merahQty.className = 'qty-display';
  merahQty.textContent = '0';
  
  const merahPlus = document.createElement('button');
  merahPlus.type = 'button';
  merahPlus.className = 'qty-btn';
  merahPlus.textContent = '+';
  
  merahMin.onclick = function() {
    let qty = parseInt(merahQty.textContent);
    if (qty > 0) {
      merahQty.textContent = qty - 1;
      updateOrderPreview();
    }
  };
  
  merahPlus.onclick = function() {
    let qty = parseInt(merahQty.textContent);
    merahQty.textContent = qty + 1;
    updateOrderPreview();
  };
  
  merahQtyGroup.appendChild(merahMin);
  merahQtyGroup.appendChild(merahQty);
  merahQtyGroup.appendChild(merahPlus);
  merahOption.appendChild(merahQtyGroup);
  options.appendChild(merahOption);
  
  // Sambal Ijo
  const ijoOption = document.createElement('div');
  ijoOption.className = 'sambal-option';
  
  const ijoLabel = document.createElement('div');
  ijoLabel.className = 'sambal-label';
  ijoLabel.textContent = '🌶️ Ijo (Pedas)';
  ijoOption.appendChild(ijoLabel);
  
  const ijoQtyGroup = document.createElement('div');
  ijoQtyGroup.className = 'qty-group';
  
  const ijoMin = document.createElement('button');
  ijoMin.type = 'button';
  ijoMin.className = 'qty-btn';
  ijoMin.textContent = '−';
  
  const ijoQty = document.createElement('span');
  ijoQty.className = 'qty-display';
  ijoQty.textContent = '0';
  
  const ijoPlus = document.createElement('button');
  ijoPlus.type = 'button';
  ijoPlus.className = 'qty-btn';
  ijoPlus.textContent = '+';
  
  ijoMin.onclick = function() {
    let qty = parseInt(ijoQty.textContent);
    if (qty > 0) {
      ijoQty.textContent = qty - 1;
      updateOrderPreview();
    }
  };
  
  ijoPlus.onclick = function() {
    let qty = parseInt(ijoQty.textContent);
    ijoQty.textContent = qty + 1;
    updateOrderPreview();
  };
  
  ijoQtyGroup.appendChild(ijoMin);
  ijoQtyGroup.appendChild(ijoQty);
  ijoQtyGroup.appendChild(ijoPlus);
  ijoOption.appendChild(ijoQtyGroup);
  options.appendChild(ijoOption);
  
  sambalSection.appendChild(options);
  row.appendChild(sambalSection);
}

function updateTotal() {
  let total = 0;

  document.querySelectorAll('#menuContainer .item-row').forEach(row => {
    const item = row.querySelector('select').value;
    const qty = parseInt(row.querySelector('.qty-group .qty-display').textContent);
    if (hargaMenu[item]) total += hargaMenu[item] * qty;
  });

  document.querySelectorAll('#extraContainer .item-row').forEach(row => {
    const item = row.querySelector('select').value;
    const qty = parseInt(row.querySelector('.qty-group .qty-display').textContent);
    if (hargaExtra[item]) total += hargaExtra[item] * qty;
  });

  document.querySelectorAll('#drinkContainer .item-row').forEach(row => {
    const item = row.querySelector('select').value;
    const qty = parseInt(row.querySelector('.qty-group .qty-display').textContent);
    if (hargaMinum[item]) total += hargaMinum[item] * qty;
  });

  document.getElementById('total').textContent = `Total: Rp ${total.toLocaleString('id-ID')}`;
}

function updateOrderPreview() {
  const preview = document.getElementById('orderPreview');
  let previewHTML = '';
  let hasItems = false;

  // Menu Utama
  document.querySelectorAll('#menuContainer .item-row').forEach(row => {
    const item = row.querySelector('select').value;
    const qty = row.querySelector('.qty-group .qty-display').textContent;
    
    if (item) {
      hasItems = true;
      previewHTML += `<div class="preview-item">
        <div class="preview-item-name">${item} x${qty}</div>
      </div>`;
      
      // Check for sambal selections
      const sambalSection = row.querySelector('.sambal-section');
      if (sambalSection) {
        const sambalDisplays = sambalSection.querySelectorAll('.qty-display');
        const merahQty = sambalDisplays[0]?.textContent || '0';
        const ijoQty = sambalDisplays[1]?.textContent || '0';
        
        if (parseInt(merahQty) > 0 || parseInt(ijoQty) > 0) {
          previewHTML += `<div class="preview-item-detail">`;
          if (parseInt(merahQty) > 0) {
            previewHTML += `Sambal Merah x${merahQty} `;
          }
          if (parseInt(ijoQty) > 0) {
            previewHTML += `Sambal Ijo x${ijoQty}`;
          }
          previewHTML += `</div>`;
        }
      }
    }
  });

  if (hasItems) previewHTML += `<div class="preview-divider"></div>`;

  // Extra Menu
  let hasExtra = false;
  document.querySelectorAll('#extraContainer .item-row').forEach(row => {
    const item = row.querySelector('select').value;
    const qty = row.querySelector('.qty-group .qty-display').textContent;
    if (item) {
      hasExtra = true;
      previewHTML += `<div class="preview-item">
        <div class="preview-item-name">${item} x${qty}</div>
      </div>`;
    }
  });

  if (hasExtra) previewHTML += `<div class="preview-divider"></div>`;

  // Minuman
  let hasDrinks = false;
  document.querySelectorAll('#drinkContainer .item-row').forEach(row => {
    const item = row.querySelector('select').value;
    const qty = row.querySelector('.qty-group .qty-display').textContent;
    if (item) {
      hasDrinks = true;
      previewHTML += `<div class="preview-item">
        <div class="preview-item-name">${item} x${qty}</div>
      </div>`;
    }
  });

  if (!hasItems && !hasExtra && !hasDrinks) {
    previewHTML = 'Silakan pilih menu untuk melihat preview pesanan...';
  }

  preview.innerHTML = previewHTML;
}

function submitOrder() {
  const btnText = document.getElementById('btnText');
  const originalText = btnText.innerHTML;
  btnText.innerHTML = '<span class="loading"></span>Memproses pesanan...';
  
  setTimeout(() => {
    const nama = document.getElementById('nama').value;
    let pesan = `🍽️ PESANAN BARU dari ${nama}\n`;
    pesan += `━━━━━━━━━━━━━━━━━━\n\n`;

    let hasItems = false;

    // Menu Utama
    document.querySelectorAll('#menuContainer .item-row').forEach(row => {
      const item = row.querySelector('select').value;
      const qty = row.querySelector('.qty-group .qty-display').textContent;
      if (item) {
        pesan += `🍗 ${item} x${qty}\n`;
        hasItems = true;
        
        // Add sambal info
        const sambalSection = row.querySelector('.sambal-section');
        if (sambalSection) {
          const sambalDisplays = sambalSection.querySelectorAll('.qty-display');
          const merahQty = sambalDisplays[0]?.textContent || '0';
          const ijoQty = sambalDisplays[1]?.textContent || '0';
          
          if (parseInt(merahQty) > 0 || parseInt(ijoQty) > 0) {
            pesan += `   🌶️ Sambal: `;
            if (parseInt(merahQty) > 0) {
              pesan += `Merah x${merahQty} `;
            }
            if (parseInt(ijoQty) > 0) {
              pesan += `Ijo x${ijoQty}`;
            }
            pesan += `\n`;
          }
        }
      }
    });

    if (hasItems) pesan += '\n';

    // Extra Menu
    let hasExtra = false;
    document.querySelectorAll('#extraContainer .item-row').forEach(row => {
      const item = row.querySelector('select').value;
      const qty = row.querySelector('.qty-group .qty-display').textContent;
      if (item) {
        if (!hasExtra) {
          pesan += '➕ EXTRA MENU:\n';
          hasExtra = true;
        }
        pesan += `   • ${item} x${qty}\n`;
      }
    });

    if (hasExtra) pesan += '\n';

    // Minuman
    let hasDrinks = false;
    document.querySelectorAll('#drinkContainer .item-row').forEach(row => {
      const item = row.querySelector('select').value;
      const qty = row.querySelector('.qty-group .qty-display').textContent;
      if (item) {
        if (!hasDrinks) {
          pesan += '🧃 MINUMAN:\n';
          hasDrinks = true;
        }
        pesan += `   • ${item} x${qty}\n`;
      }
    });

    if (hasDrinks) pesan += '\n';

    pesan += `━━━━━━━━━━━━━━━━━━\n`;
    pesan += `💰 ${document.getElementById('total').textContent}\n`;
    pesan += `━━━━━━━━━━━━━━━━━━\n\n`;
    pesan += `📝 Pesanan ini dikirim otomatis dari website\n`;
    pesan += `⏰ ${new Date().toLocaleString('id-ID')}`;

    const encoded = encodeURIComponent(pesan);
    const phone = '6287859697616';
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
    
    btnText.innerHTML = originalText;
  }, 1500);
}
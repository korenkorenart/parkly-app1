import React from 'react'

export default function FilterBar({ filters, onChange }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    onChange({ ...filters, [name]: type === 'checkbox' ? checked : value })
  }

  return (
    <div className="filter-bar">
      <label>
        מחיר עד:
        <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleChange} min="0" />
      </label>
      <label>
        פנויות בלבד:
        <input type="checkbox" name="onlyAvailable" checked={filters.onlyAvailable} onChange={handleChange} />
      </label>
      <label>
        מיין לפי:
        <select name="sort" value={filters.sort} onChange={handleChange}>
          <option value="none">ללא</option>
          <option value="price-asc">מחיר - עולה</option>
          <option value="price-desc">מחיר - יורד</option>
        </select>
      </label>
    </div>
  )
}

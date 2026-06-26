import React from 'react'

export default function FilterBar({ filters, onChange }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    onChange({
      ...filters,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const clearFilters = () => {
    onChange({
      query: '',
      maxPrice: '',
      onlyAvailable: false,
      sort: 'none',
    })
  }

  return (
    <section className="advanced-filter-bar" aria-label="סינון חניות">
      <div className="filter-header">
        <h3>🔎 חיפוש וסינון</h3>
        <button
          type="button"
          className="btn secondary"
          onClick={clearFilters}
        >
          איפוס
        </button>
      </div>

      <div className="filter-grid">
        <label>
          חיפוש חניה
          <input
            type="search"
            name="query"
            value={filters.query || ''}
            onChange={handleChange}
            placeholder="חפש לפי שם חניון או כתובת..."
          />
        </label>

        <label>
          מחיר מקסימלי לשעה
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            min="0"
            placeholder="לדוגמה 20"
          />
        </label>

        <label>
          מיון
          <select
            name="sort"
            value={filters.sort}
            onChange={handleChange}
          >
            <option value="none">ללא מיון</option>
            <option value="price-asc">מחיר מהנמוך לגבוה</option>
            <option value="price-desc">מחיר מהגבוה לנמוך</option>
          </select>
        </label>

        <label className="checkbox-row">
          <input
            type="checkbox"
            name="onlyAvailable"
            checked={filters.onlyAvailable}
            onChange={handleChange}
          />
          הצג רק חניות פנויות
        </label>
      </div>
    </section>
  )
}
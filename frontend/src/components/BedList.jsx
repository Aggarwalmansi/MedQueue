import React from "react"
import BedCard from "./BedCard"
import "../styles/BedList.css"

export default function BedList({ beds, token, onBedUpdated, onBedDeleted }) {
  if (beds.length === 0) {
    return <div className="empty-state">No beds found. Create one to get started.</div>
  }

  return (
    <div className="bed-list">
      {beds.map((bed) => (
        <BedCard key={bed.id} bed={bed} token={token} onUpdated={onBedUpdated} onDeleted={onBedDeleted} />
      ))}
    </div>
  )
}

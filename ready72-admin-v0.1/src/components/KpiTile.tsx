import React from 'react'

export function KpiTile({label, value}:{label:string, value:number|string}){
  return (
    <div className="card">
      <div className="subtitle">{label}</div>
      <div className="title">{typeof value === 'number' ? value.toLocaleString() : value}</div>
    </div>
  )
}

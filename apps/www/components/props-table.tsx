type PropDefinition = {
  name: string
  type: string
  defaultValue?: string
  description: string
}

export function PropsTable({ rows }: { rows: PropDefinition[] }) {
  return (
    <div className="props-table-wrapper not-prose" role="region" aria-label="组件属性" tabIndex={0}>
      <table className="props-table">
        <thead>
          <tr>
            <th scope="col">属性</th>
            <th scope="col">类型</th>
            <th scope="col">默认值</th>
            <th scope="col">说明</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((prop) => (
            <tr key={prop.name}>
              <td><code>{prop.name}</code></td>
              <td><code>{prop.type}</code></td>
              <td>{prop.defaultValue === undefined ? "—" : <code>{prop.defaultValue}</code>}</td>
              <td>{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

import "./ServicePicker.css";

function makeServiceId(branchId, heading, subgroupTitle, description, unitPrice) {
  return `${branchId}::${heading}::${subgroupTitle}::${description}::${unitPrice}`;
}

export default function ServicePicker({
  branch,
  parseKesToNumber,
  selectedItems,
  setSelectedItems
}) {
  if (!branch) return null;

  function addService({ heading, subgroupTitle, service }) {
    const unitPrice = parseKesToNumber(service.price);
    const minutes = service.value || 0;

    const id = makeServiceId(branch.id, heading, subgroupTitle, service.description, unitPrice);

    setSelectedItems((prev) => {
      const existing = prev.find((p) => p.id === id);
      if (existing) {
        return prev.map((p) => (p.id === id ? { ...p, qty: p.qty + 1 } : p));
      }
      return [
        ...prev,
        {
          id,
          branchId: branch.id,
          heading,
          subgroupTitle,
          description: service.description,
          minutes,
          unitPrice,
          qty: 1
        }
      ];
    });
  }

  function inc(id) {
    setSelectedItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty: p.qty + 1 } : p)));
  }

  function dec(id) {
    setSelectedItems((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, qty: Math.max(1, p.qty - 1) } : p))
    );
  }

  function remove(id) {
    setSelectedItems((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="servicePicker">
      <div className="serviceGrid">
        <div className="catalog">
          {branch.serviceCategories.map((cat) => (
            <details key={cat.heading} className="cat" open>
              <summary>{cat.heading}</summary>

              {cat.subgroups.map((sg) => (
                <div key={sg.title} className="subgroup">
                  <div className="subTitle">{sg.title}</div>

                  <div className="serviceList">
                    {sg.services.map((svc) => {
                      const unitPrice = parseKesToNumber(svc.price);
                      return (
                        <div key={svc.description + svc.price} className="serviceRow">
                          <div className="left">
                            <div className="desc">{svc.description}</div>
                            <div className="meta">
                              {svc.value ? `${svc.value} mins` : "Add-on"} • {svc.price}
                            </div>
                          </div>
                          <button
                            type="button"
                            className="btn"
                            onClick={() =>
                              addService({
                                heading: cat.heading,
                                subgroupTitle: sg.title,
                                service: svc
                              })
                            }
                            disabled={unitPrice === 0}
                            title={unitPrice === 0 ? "Add-ons priced at 0 are disabled in prototype" : "Add"}
                          >
                            Add
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </details>
          ))}
        </div>

        <div className="cart">
          <div className="cartTitle">Selected Services</div>

          {selectedItems.length === 0 ? (
            <div className="empty">No services selected yet.</div>
          ) : (
            <div className="cartList">
              {selectedItems.map((it) => (
                <div key={it.id} className="cartItem">
                  <div className="ciTop">
                    <div className="ciName">{it.description}</div>
                    <button type="button" className="btn" onClick={() => remove(it.id)}>
                      Remove
                    </button>
                  </div>

                  <div className="ciMeta">
                    <span>{it.heading} • {it.subgroupTitle}</span>
                    <span>KES {it.unitPrice.toLocaleString()}</span>
                  </div>

                  <div className="qtyRow">
                    <button type="button" className="btn" onClick={() => dec(it.id)}>-</button>
                    <div className="qty">{it.qty}</div>
                    <button type="button" className="btn" onClick={() => inc(it.id)}>+</button>
                    <div className="lineTotal">
                      Line: <b>KES {(it.unitPrice * it.qty).toLocaleString()}</b>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="hint">
            Tip: This is a “bundle builder”. The voucher amount becomes the total of selected services.
          </div>
        </div>
      </div>
    </div>
  );
}

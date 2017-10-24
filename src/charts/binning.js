import * as d3 from "./helpers/d3-service"

import {exclusiveToggle} from "./interactors"

export default function Binning (_container) {

  let config = {
    margin: {
      top: 60,
      right: 30,
      bottom: 40,
      left: 70
    },
    width: 800,
    height: 500,
    autoLabel: "auto",
    exclusiveToggle: ["1y", "1q", "1mo", "1w"],
    label: "BIN:"
  }

  const cache = {
    container: _container,
    root: null,
    autoItem: null,
    binningItems: null,
    selectedBin: null,
    isAuto: true
  }

  // events
  const dispatcher = d3.dispatch("change")

  function buildSVG () {

    if (!cache.root) {
      cache.root = cache.container.append("div")
          .attr("class", "binning-group")
          .style("float", "left")

      cache.label = cache.root.append("div")
          .attr("class", "label")
          .text(config.label)

      cache.autoItem = cache.root.append("div")
          .attr("class", "item item-auto toggleOnOff")
          .on("click.select", function click (d) {
            const isSelected = this.classList.contains("selected")
            const toggled = !isSelected
            setAuto(toggled)
            drawBinning()
            dispatcher.call("change", this, d, {isSelected: toggled})
          })
          .text(config.autoLabel)

      cache.binningItems = cache.root.selectAll(".toggleExclusive")
          .data(config.exclusiveToggle)
          .enter().append("div")
          .attr("class", (d) => `item item-${d} toggleExclusive`)
          .on("click.select", function click (d) {
            setBinning(d)
            drawBinning()
            const isSelected = this.classList.contains("selected")
            dispatcher.call("change", this, d, {isSelected})
          })
          .text((d) => d)
    }

    const LINE_HEIGHT = 20
    cache.root
      .style("top", config.margin.top - LINE_HEIGHT)
      .style("left", config.margin.left)

    changeBinning(cache.selectedBin)
    toggleAuto(cache.isAuto)
  }

  function changeBinning (_selectedItemName) {
    if (_selectedItemName) {
      exclusiveToggle(cache.binningItems, `.item-${_selectedItemName}`)
    }
  }

  function toggleAuto (_shouldBeSelected) {
    cache.autoItem
      .classed("selected", _shouldBeSelected)
      .classed("dimmed", !_shouldBeSelected)
  }

  function drawBinning () {
    buildSVG()
    return this
  }

  function setBinning (_selectedBin) {
    cache.selectedBin = _selectedBin
    return this
  }

  function setAuto (_isAuto) {
    cache.isAuto = _isAuto
    return this
  }

  function on (...args) {
    dispatcher.on(...args)
    return this
  }

  function setConfig (_config) {
    config = Object.assign({}, config, _config)
    return this
  }

  function destroy () {
    cache.root.remove()
  }

  return {
    on,
    setConfig,
    destroy,
    drawBinning,
    setBinning,
    setAuto
  }
}

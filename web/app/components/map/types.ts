export type Coordinate = [number, number]

export type XY = {
  x: number
  y: number
}

export type CardinalCoordinates = {
  east: number
  north: number
  south: number
  west: number
}

export type Dimensions = {
  width: number
  height: number
}

export type ImagePosition = {
  top: number
  left: number
}

export type ViewPort = {
  aspectRatio: number
  translate: [number, number]
  scale: number
}

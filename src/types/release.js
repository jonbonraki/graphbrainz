import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql/type'
import { connectionDefinitions } from 'graphql-relay'
import Node from './node'
import Entity from './entity'
import { DateType } from './scalars'
import { ReleaseStatus } from './enums'
import ReleaseEvent from './release-event'
import {
  id,
  mbid,
  title,
  disambiguation,
  artistCredit,
  artists,
  labels,
  recordings,
  releaseGroups,
  relationships,
  getHyphenated,
  fieldWithID
} from './helpers'

const Release = new GraphQLObjectType({
  name: 'Release',
  description: `A [release](https://musicbrainz.org/doc/Release) represents the
unique release (i.e. issuing) of a product on a specific date with specific
release information such as the country, label, barcode, packaging, etc. If you
walk into a store and purchase an album or single, they’re each represented in
MusicBrainz as one release.`,
  interfaces: () => [Node, Entity],
  fields: () => ({
    id,
    mbid,
    title,
    disambiguation,
    artistCredit,
    releaseEvents: {
      type: new GraphQLList(ReleaseEvent),
      description: 'The release events for this release.',
      resolve: getHyphenated
    },
    date: {
      type: DateType,
      description: `The [release date](https://musicbrainz.org/doc/Release/Date)
is the date in which a release was made available through some sort of
distribution mechanism.`
    },
    country: {
      type: GraphQLString,
      description: 'The country in which the release was issued.'
    },
    barcode: {
      type: GraphQLString,
      description: `The [barcode](https://en.wikipedia.org/wiki/Barcode), if the
release has one. The most common types found on releases are 12-digit
[UPCs](https://en.wikipedia.org/wiki/Universal_Product_Code) and 13-digit
[EANs](https://en.wikipedia.org/wiki/International_Article_Number).`
    },
    ...fieldWithID('status', {
      type: ReleaseStatus,
      description: 'The status describes how “official” a release is.'
    }),
    ...fieldWithID('packaging', {
      description: `The physical packaging that accompanies the release. See
the [list of packaging](https://musicbrainz.org/doc/Release/Packaging) for more
information.`
    }),
    quality: {
      type: GraphQLString,
      description: `Data quality indicates how good the data for a release is.
It is not a mark of how good or bad the music itself is – for that, use
[ratings](https://musicbrainz.org/doc/Rating_System).`
    },
    artists,
    labels,
    recordings,
    releaseGroups,
    relationships
  })
})

const { connectionType: ReleaseConnection } = connectionDefinitions({ nodeType: Release })
export { ReleaseConnection }
export default Release

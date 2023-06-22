/**
 * App Creator guid for Jellyfin Media Segments creator field
 */
export const CREATOR_UUID = 'b7e8f085042d4dc8a042da13773afd9b';

/**
 *  Map uuid to segment creator names
 */
export function getNameForCreatorId(id: string) {
  switch (id) {
    case '80885677dacb461bac97ee7e971288aa':
      return 'Media Analyzer'
    case 'b7e8f085042d4dc8a042da13773afd9b':
      return 'Segment Editor'

    default:
      return `Who is? id=${id}`
  }
}
